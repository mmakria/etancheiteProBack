import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import LeakDetection from '#models/leak_detection'
import { createLeakDetectionValidator, updateLeakDetectionValidator } from '#validators/leak_detection_validator'
import BookingConfirmationNotification from '#mails/booking_confirmation_notification'
import AdminNewBookingNotification from '#mails/admin_new_booking_notification'
import googleCalendar from '#services/google_calendar_service'

export default class LeakDetectionsController {
  /**
   * POST /api/v1/leak-detections — Public: create a leak detection request
   */
  async store({ request, response }: HttpContext) {
    const { appointmentDate, ...modelData } = await request.validateUsing(createLeakDetectionValidator)

    // Check slot availability on Google Calendar before saving
    if (appointmentDate) {
      const [date, timePart] = appointmentDate.split('T')
      if (date && timePart) {
        const time = timePart.substring(0, 5) // "HH:mm"
        const available = await googleCalendar.isSlotAvailable(date, time)
        if (!available) {
          return response.conflict({
            code: 'SLOT_TAKEN',
            message: 'Ce créneau vient d\'être réservé par un autre client. Veuillez en choisir un autre.',
          })
        }
      }
    }

    let detection: LeakDetection

    const isNew = modelData.folderId
      ? !(await LeakDetection.findBy('folderId', modelData.folderId))
      : true

    const payload = {
      ...modelData,
      ...(appointmentDate ? { appointmentDate: DateTime.fromISO(appointmentDate) } : {}),
      paymentStatus: 'pending' as const,
      amountCents: 25000,
      status: 'submitted' as const,
    }

    if (modelData.folderId) {
      detection = await LeakDetection.updateOrCreate(
        { folderId: modelData.folderId },
        payload
      )
    } else {
      detection = await LeakDetection.create(payload)
    }

    if (isNew) {
      try {
        await mail.send(new BookingConfirmationNotification(detection))
        await mail.send(new AdminNewBookingNotification(detection))
      } catch (error) {
        console.error('Failed to send booking emails:', error)
      }
    }

    return response.created(detection)
  }

  /**
   * GET /api/v1/admin/leak-detections — Admin: list all
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status')

    const query = LeakDetection.query().orderBy('created_at', 'desc')

    if (status) {
      query.where('status', status)
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/admin/leak-detections/:id — Admin: show one
   */
  async show({ params }: HttpContext) {
    return LeakDetection.findOrFail(params.id)
  }

  /**
   * PUT /api/v1/admin/leak-detections/:id — Admin: update
   */
  async update({ params, request }: HttpContext) {
    const detection = await LeakDetection.findOrFail(params.id)
    const data = await request.validateUsing(updateLeakDetectionValidator)
    const { appointmentDate, ...rest } = data
    detection.merge(rest)
    if (appointmentDate) {
      detection.appointmentDate = DateTime.fromISO(appointmentDate)
    }
    await detection.save()
    return detection
  }

  /**
   * DELETE /api/v1/admin/leak-detections/:id — Admin: delete
   */
  async destroy({ params, response }: HttpContext) {
    const detection = await LeakDetection.findOrFail(params.id)
    await detection.delete()
    return response.noContent()
  }
}
