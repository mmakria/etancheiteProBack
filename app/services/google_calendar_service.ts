import { google, calendar_v3 } from 'googleapis'
import env from '#start/env'

interface SlotInfo {
  time: string
  available: boolean
}

interface DaySlots {
  date: string
  dayName: string
  dayNum: number
  monthShort: string
  slots: SlotInfo[]
}

interface CreateEventParams {
  date: string
  time: string
  firstName: string
  lastName: string
  address: string
  leakType: string
  folderId: string | null
  phone: string
}

class GoogleCalendarService {
  private calendar: calendar_v3.Calendar | null = null
  private calendarId: string = ''

  private getClient(): calendar_v3.Calendar | null {
    if (this.calendar) return this.calendar

    const calendarId = env.get('GOOGLE_CALENDAR_ID')
    const clientEmail = env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
    const privateKey = env.get('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')

    if (!calendarId || !clientEmail || !privateKey) {
      return null
    }

    this.calendarId = calendarId

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    this.calendar = google.calendar({ version: 'v3', auth })
    return this.calendar
  }

  async getAvailableSlots(weekStartISO: string): Promise<DaySlots[]> {
    const weekStart = new Date(weekStartISO + 'T00:00:00Z')
    const workingDays = [1, 2, 3, 4, 5, 6] // Mon-Sat
    const startHour = 8
    const endHour = 18

    // Minimum advance: no appointments today
    const now = new Date()
    const minDate = new Date(now)
    minDate.setDate(minDate.getDate() + 1)
    minDate.setHours(0, 0, 0, 0)

    // Build the days array
    const days: DaySlots[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      const isoDay = d.getDay() === 0 ? 7 : d.getDay()
      if (!workingDays.includes(isoDay)) continue

      const dateStr = d.toISOString().split('T')[0]!
      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short', timeZone: 'Europe/Paris' })
      const dayNum = d.getDate()
      const monthShort = d.toLocaleDateString('fr-FR', { month: 'short', timeZone: 'Europe/Paris' })

      const slots: SlotInfo[] = []
      for (let h = startHour; h < endHour; h++) {
        const time = `${String(h).padStart(2, '0')}:00`
        const slotDateTime = new Date(`${dateStr}T${time}:00`)

        // Past slots are unavailable
        if (slotDateTime < minDate) {
          slots.push({ time, available: false })
        } else {
          slots.push({ time, available: true })
        }
      }

      days.push({ date: dateStr, dayName, dayNum, monthShort, slots })
    }

    // Query Google Calendar for busy times
    const client = this.getClient()
    if (!client) return days

    try {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const response = await client.freebusy.query({
        requestBody: {
          timeMin: weekStart.toISOString(),
          timeMax: weekEnd.toISOString(),
          timeZone: 'Europe/Paris',
          items: [{ id: this.calendarId }],
        },
      })

      const busySlots = response.data.calendars?.[this.calendarId]?.busy ?? []

      // Mark busy slots as unavailable
      for (const busy of busySlots) {
        if (!busy.start || !busy.end) continue
        const busyStart = new Date(busy.start)
        const busyEnd = new Date(busy.end)

        for (const day of days) {
          for (const slot of day.slots) {
            if (!slot.available) continue

            const slotStart = new Date(`${day.date}T${slot.time}:00+01:00`)
            const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)

            // If busy period overlaps with this slot
            if (busyStart < slotEnd && busyEnd > slotStart) {
              slot.available = false
            }
          }
        }
      }
    } catch (error) {
      console.error('Google Calendar freebusy query failed, showing all as available:', error)
      // Graceful degradation: all slots remain available
    }

    return days
  }

  async isSlotAvailable(date: string, time: string): Promise<boolean> {
    const client = this.getClient()
    if (!client) return true // Graceful degradation

    try {
      const slotStart = new Date(`${date}T${time}:00+01:00`)
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)

      const response = await client.freebusy.query({
        requestBody: {
          timeMin: slotStart.toISOString(),
          timeMax: slotEnd.toISOString(),
          timeZone: 'Europe/Paris',
          items: [{ id: this.calendarId }],
        },
      })

      const busySlots = response.data.calendars?.[this.calendarId]?.busy ?? []
      return busySlots.length === 0
    } catch (error) {
      console.error('Google Calendar availability check failed:', error)
      return true // Graceful degradation
    }
  }

  async createEvent(params: CreateEventParams): Promise<string | null> {
    const client = this.getClient()
    if (!client) return null

    try {
      const startDateTime = `${params.date}T${params.time}:00+01:00`
      const endDate = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000)

      const leakLabels: Record<string, string> = {
        roof: 'Toiture',
        terrace: 'Terrasse',
        wall: 'Mur',
        basement: 'Sous-sol',
        other: 'Autre',
      }

      const response = await client.events.insert({
        calendarId: this.calendarId,
        requestBody: {
          summary: `RDV Fuite — ${params.firstName} ${params.lastName}`,
          description: [
            `Client : ${params.firstName} ${params.lastName}`,
            `Tél : ${params.phone}`,
            `Adresse : ${params.address}`,
            `Type de fuite : ${leakLabels[params.leakType] ?? params.leakType}`,
            params.folderId ? `N° dossier : ${params.folderId}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          location: params.address,
          start: {
            dateTime: startDateTime,
            timeZone: 'Europe/Paris',
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: 'Europe/Paris',
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 60 },
              { method: 'popup', minutes: 15 },
            ],
          },
        },
      })

      return response.data.id ?? null
    } catch (error) {
      console.error('Google Calendar event creation failed:', error)
      return null
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const client = this.getClient()
    if (!client) return

    try {
      await client.events.delete({
        calendarId: this.calendarId,
        eventId,
      })
    } catch (error) {
      console.error('Google Calendar event deletion failed:', error)
    }
  }
}

export default new GoogleCalendarService()
