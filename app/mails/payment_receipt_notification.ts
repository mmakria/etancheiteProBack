import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import LeakDetection from '#models/leak_detection'
import { leakTypeLabels, severityLabels } from '../utils/labels.js'
import {
  getLogoUrl,
  getProcessTimeline,
  getPrecautionaryMeasures,
  getPrecautionColors,
  COMPANY_INFO,
} from '../utils/email_helpers.js'

export default class PaymentReceiptNotification extends BaseMail {
  subject = ''

  private amountEuros: string

  constructor(private detection: LeakDetection) {
    super()
    this.subject = `Confirmation de votre réservation — Dossier ${detection.folderId?.slice(0, 8) ?? ''}`
    this.amountEuros = ((detection.amountCents ?? 25000) / 100).toFixed(2)
  }

  prepare() {
    const frontendUrl = env.get('FRONTEND_URL')
    const templateData = {
      detection: this.detection,
      amountEuros: this.amountEuros,
      leakTypeLabels,
      severityLabels,
      logoUrl: getLogoUrl(frontendUrl),
      timeline: getProcessTimeline(2),
      precautions: getPrecautionaryMeasures(this.detection.severity, this.detection.leakType),
      precautionColors: getPrecautionColors(this.detection.severity),
      company: COMPANY_INFO,
      websiteUrl: frontendUrl,
    }

    this.message
      .to(this.detection.email)
      .replyTo(COMPANY_INFO.email)
      .htmlView('emails/payment_receipt_html', templateData)
      .textView('emails/payment_receipt_text', templateData)
  }
}
