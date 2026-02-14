import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import LeakDetection from '#models/leak_detection'
import { leakTypeLabels, severityLabels, paymentStatusLabels } from '../utils/labels.js'

export default class AdminNewBookingNotification extends BaseMail {
  subject = ''

  constructor(private detection: LeakDetection) {
    super()
    this.subject = `Nouveau dossier recherche de fuite — ${detection.firstName} ${detection.lastName}`
  }

  prepare() {
    this.message
      .to(env.get('ADMIN_EMAIL'))
      .htmlView('emails/admin_new_booking_html', {
        detection: this.detection,
        leakTypeLabels,
        severityLabels,
        paymentStatusLabels,
      })
      .textView('emails/admin_new_booking_text', {
        detection: this.detection,
        leakTypeLabels,
        severityLabels,
        paymentStatusLabels,
      })
  }
}
