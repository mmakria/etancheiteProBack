import { BaseMail } from '@adonisjs/mail'
import LeakDetection from '#models/leak_detection'
import { leakTypeLabels, severityLabels } from '../utils/labels.js'

export default class BookingConfirmationNotification extends BaseMail {
  subject = ''

  constructor(private detection: LeakDetection) {
    super()
    this.subject = `Confirmation de votre demande — Dossier ${detection.folderId?.slice(0, 8) ?? ''}`
  }

  prepare() {
    this.message
      .to(this.detection.email)
      .htmlView('emails/booking_confirmation_html', {
        detection: this.detection,
        leakTypeLabels,
        severityLabels,
      })
      .textView('emails/booking_confirmation_text', {
        detection: this.detection,
        leakTypeLabels,
        severityLabels,
      })
  }
}
