import type { HttpContext } from '@adonisjs/core/http'
import googleCalendar from '#services/google_calendar_service'

export default class AppointmentsController {
  async availableSlots({ request, response }: HttpContext) {
    const weekStart = request.input('week_start')

    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return response.badRequest({ error: 'week_start is required (YYYY-MM-DD format)' })
    }

    const date = new Date(weekStart + 'T00:00:00Z')
    const dayOfWeek = date.getUTCDay()

    // Must be a Monday (day 1)
    if (dayOfWeek !== 1) {
      return response.badRequest({ error: 'week_start must be a Monday' })
    }

    const data = await googleCalendar.getAvailableSlots(weekStart)
    return response.ok({ data })
  }
}
