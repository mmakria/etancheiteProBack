import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import ContactMessage from '#models/contact_message'
import { getLogoUrl, COMPANY_INFO } from '../utils/email_helpers.js'

export default class ContactFormConfirmation extends BaseMail {
  subject = 'Nous avons bien reçu votre message — Makria'

  constructor(private contact: ContactMessage) {
    super()
  }

  prepare() {
    const frontendUrl = env.get('FRONTEND_URL')
    const templateData = {
      contact: this.contact,
      logoUrl: getLogoUrl(frontendUrl),
      company: COMPANY_INFO,
      websiteUrl: frontendUrl,
    }

    this.message
      .to(this.contact.email)
      .replyTo(COMPANY_INFO.email)
      .htmlView('emails/contact_form_confirmation_html', templateData)
      .textView('emails/contact_form_confirmation_text', templateData)
  }
}
