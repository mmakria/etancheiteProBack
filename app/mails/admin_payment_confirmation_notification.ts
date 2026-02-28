import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import LeakDetection from '#models/leak_detection'
import { leakTypeLabels, severityLabels, paymentStatusLabels } from '../utils/labels.js'
import { getLogoUrl, COMPANY_INFO } from '../utils/email_helpers.js'

export default class AdminPaymentConfirmationNotification extends BaseMail {
  subject = ''

  private amountEuros: string

  constructor(private detection: LeakDetection) {
    super()
    this.subject = `Paiement confirmé — ${detection.firstName} ${detection.lastName}`
    this.amountEuros = ((detection.amountCents ?? 25000) / 100).toFixed(2)
  }

  prepare() {
    const templateData = {
      detection: this.detection,
      amountEuros: this.amountEuros,
      leakTypeLabels,
      severityLabels,
      paymentStatusLabels,
      logoUrl: getLogoUrl(env.get('FRONTEND_URL')),
      company: COMPANY_INFO,
    }

    this.message
      .to(env.get('ADMIN_EMAIL'))
      .htmlView('emails/admin_payment_confirmation_html', templateData)
      .textView('emails/admin_payment_confirmation_text', templateData)
  }
}
