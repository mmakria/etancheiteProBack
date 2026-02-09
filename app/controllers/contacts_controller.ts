import type { HttpContext } from '@adonisjs/core/http'
import ContactMessage from '#models/contact_message'
import { createContactValidator } from '#validators/contact_validator'

export default class ContactsController {
  /**
   * POST /api/v1/contacts — Public: create a contact message
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createContactValidator)
    const message = await ContactMessage.create(data)
    return response.created(message)
  }

  /**
   * GET /api/v1/admin/contacts — Admin: list all messages
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const isRead = request.input('is_read')

    const query = ContactMessage.query().orderBy('created_at', 'desc')

    if (isRead !== undefined) {
      query.where('is_read', isRead === 'true')
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/admin/contacts/:id — Admin: show one
   */
  async show({ params }: HttpContext) {
    return ContactMessage.findOrFail(params.id)
  }

  /**
   * PUT /api/v1/admin/contacts/:id/read — Admin: mark as read
   */
  async markRead({ params }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    message.isRead = true
    await message.save()
    return message
  }

  /**
   * DELETE /api/v1/admin/contacts/:id — Admin: delete
   */
  async destroy({ params, response }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    await message.delete()
    return response.noContent()
  }
}
