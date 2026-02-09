import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Simple in-memory rate limiter for public POST routes.
 * Limits requests per IP to prevent form spam.
 */
const requests = new Map<string, { count: number; resetAt: number }>()

export default class ThrottleMiddleware {
  private maxRequests = 10
  private windowMs = 60_000 // 1 minute

  async handle(ctx: HttpContext, next: NextFn) {
    const ip = ctx.request.ip()
    const now = Date.now()

    const entry = requests.get(ip)

    if (!entry || now > entry.resetAt) {
      requests.set(ip, { count: 1, resetAt: now + this.windowMs })
      return next()
    }

    if (entry.count >= this.maxRequests) {
      ctx.response.tooManyRequests({
        error: 'Trop de requêtes. Veuillez réessayer dans une minute.',
      })
      return
    }

    entry.count++
    return next()
  }
}
