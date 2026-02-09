import type { HttpContext } from '@adonisjs/core/http'
import CityPage from '#models/city_page'

export default class CitiesController {
  /**
   * GET /api/v1/cities — Public: list published city pages
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const department = request.input('department_code')

    const query = CityPage.query()
      .where('published', true)
      .orderBy('name', 'asc')

    if (department) {
      query.where('department_code', department)
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/cities/:slug — Public: show by slug
   */
  async show({ params }: HttpContext) {
    return CityPage.query()
      .where('slug', params.slug)
      .where('published', true)
      .firstOrFail()
  }

  /**
   * POST /api/v1/admin/cities — Admin: create
   */
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'slug', 'name', 'department', 'departmentCode', 'postalCodes',
      'seoTitle', 'seoDescription', 'introContent', 'mainContent',
      'keywords', 'nearbyServices', 'neighborCities', 'published',
    ])
    const city = await CityPage.create(data)
    return response.created(city)
  }

  /**
   * PUT /api/v1/admin/cities/:id — Admin: update
   */
  async update({ params, request }: HttpContext) {
    const city = await CityPage.findOrFail(params.id)
    const data = request.only([
      'name', 'department', 'departmentCode', 'postalCodes',
      'seoTitle', 'seoDescription', 'introContent', 'mainContent',
      'keywords', 'nearbyServices', 'neighborCities', 'published',
    ])
    city.merge(data)
    await city.save()
    return city
  }

  /**
   * DELETE /api/v1/admin/cities/:id — Admin: delete
   */
  async destroy({ params, response }: HttpContext) {
    const city = await CityPage.findOrFail(params.id)
    await city.delete()
    return response.noContent()
  }
}
