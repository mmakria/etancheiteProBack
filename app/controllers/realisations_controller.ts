import type { HttpContext } from '@adonisjs/core/http'
import Realisation from '#models/realisation'
import { createRealisationValidator, updateRealisationValidator } from '#validators/realisation_validator'

export default class RealisationsController {
  /**
   * GET /api/v1/realisations — Public: list published realisations
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const pole = request.input('pole')

    const query = Realisation.query()
      .where('published', true)
      .preload('images')
      .orderBy('project_date', 'desc')

    if (pole) {
      query.where('pole', pole)
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/realisations/:slug — Public: show by slug
   */
  async show({ params }: HttpContext) {
    return Realisation.query()
      .where('slug', params.slug)
      .where('published', true)
      .preload('images', (q) => q.orderBy('sort_order', 'asc'))
      .firstOrFail()
  }

  /**
   * POST /api/v1/admin/realisations — Admin: create
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createRealisationValidator)
    const realisation = await Realisation.create(data)
    return response.created(realisation)
  }

  /**
   * PUT /api/v1/admin/realisations/:id — Admin: update
   */
  async update({ params, request }: HttpContext) {
    const realisation = await Realisation.findOrFail(params.id)
    const data = await request.validateUsing(updateRealisationValidator)
    realisation.merge(data)
    await realisation.save()
    return realisation
  }

  /**
   * DELETE /api/v1/admin/realisations/:id — Admin: delete
   */
  async destroy({ params, response }: HttpContext) {
    const realisation = await Realisation.findOrFail(params.id)
    await realisation.delete()
    return response.noContent()
  }
}
