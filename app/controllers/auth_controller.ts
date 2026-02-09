import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)

export default class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      type: 'bearer',
      token: token.value!.release(),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user!.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)
    return response.noContent()
  }

  /**
   * GET /api/v1/auth/me
   */
  async me({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    }
  }
}
