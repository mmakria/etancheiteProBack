import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user_validator'

export default class UsersController {
  /**
   * GET /api/v1/admin/users — Admin: list all users
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    return User.query().orderBy('created_at', 'desc').paginate(page, limit)
  }

  /**
   * POST /api/v1/admin/users — Admin: create a user
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.conflict({ errors: [{ message: 'Cet email est déjà utilisé' }] })
    }

    const user = await User.create(data)
    return response.created(user)
  }

  /**
   * PUT /api/v1/admin/users/:id — Admin: update a user
   */
  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = await request.validateUsing(updateUserValidator)
    user.merge(data)
    await user.save()
    return user
  }

  /**
   * DELETE /api/v1/admin/users/:id — Admin: delete a user
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user!.id) {
      return response.forbidden({ errors: [{ message: 'Vous ne pouvez pas supprimer votre propre compte' }] })
    }

    await user.delete()
    return response.noContent()
  }
}
