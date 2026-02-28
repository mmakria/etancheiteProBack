import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import ContactMessage from '#models/contact_message'
import { getLogoUrl, COMPANY_INFO } from '../utils/email_helpers.js'

export default class AdminContactNotification extends BaseMail {
  subject = ''

  constructor(private contact: ContactMessage) {
    super()
    this.subject = `Nouveau message contact — ${contact.firstName} ${contact.lastName}`
  }

  prepare() {
    const templateData = {
      contact: this.contact,
      logoUrl: getLogoUrl(env.get('FRONTEND_URL')),
      company: COMPANY_INFO,
    }

    this.message
      .to(env.get('ADMIN_EMAIL'))
      .replyTo(this.contact.email)
      .htmlView('emails/admin_contact_notification_html', templateData)
      .textView('emails/admin_contact_notification_text', templateData)
  }
}
