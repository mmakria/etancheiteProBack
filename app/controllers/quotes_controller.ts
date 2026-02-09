import type { HttpContext } from '@adonisjs/core/http'
import QuoteRequest from '#models/quote_request'
import { createQuoteValidator, updateQuoteValidator } from '#validators/quote_validator'

export default class QuotesController {
  /**
   * POST /api/v1/quotes — Public: create a quote request
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createQuoteValidator)
    const quote = await QuoteRequest.create(data)
    return response.created(quote)
  }

  /**
   * GET /api/v1/admin/quotes — Admin: list all quotes
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status')

    const query = QuoteRequest.query().orderBy('created_at', 'desc')

    if (status) {
      query.where('status', status)
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/admin/quotes/:id — Admin: show a quote
   */
  async show({ params }: HttpContext) {
    return QuoteRequest.findOrFail(params.id)
  }

  /**
   * PUT /api/v1/admin/quotes/:id — Admin: update a quote
   */
  async update({ params, request }: HttpContext) {
    const quote = await QuoteRequest.findOrFail(params.id)
    const data = await request.validateUsing(updateQuoteValidator)
    quote.merge(data)
    await quote.save()
    return quote
  }

  /**
   * DELETE /api/v1/admin/quotes/:id — Admin: delete a quote
   */
  async destroy({ params, response }: HttpContext) {
    const quote = await QuoteRequest.findOrFail(params.id)
    await quote.delete()
    return response.noContent()
  }
}
