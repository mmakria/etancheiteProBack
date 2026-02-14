import { BaseMail } from '@adonisjs/mail'
import LeakDetection from '#models/leak_detection'
import { leakTypeLabels, severityLabels } from '../utils/labels.js'

export default class PaymentReceiptNotification extends BaseMail {
  subject = 'Reçu de paiement — Recherche de fuite'

  private amountEuros: string

  constructor(private detection: LeakDetection) {
    super()
    this.amountEuros = ((detection.amountCents ?? 25000) / 100).toFixed(2)
  }

  prepare() {
    this.message
      .to(this.detection.email)
      .htmlView('emails/payment_receipt_html', {
        detection: this.detection,
        amountEuros: this.amountEuros,
        leakTypeLabels,
        severityLabels,
      })
      .textView('emails/payment_receipt_text', {
        detection: this.detection,
        amountEuros: this.amountEuros,
        leakTypeLabels,
        severityLabels,
      })
  }
}
