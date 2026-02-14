import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Stripe from 'stripe'
import mail from '@adonisjs/mail/services/main'
import LeakDetection from '#models/leak_detection'
import PaymentReceiptNotification from '#mails/payment_receipt_notification'

const stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))

export default class StripeController {
  /**
   * POST /api/v1/stripe/create-checkout-session
   */
  async createCheckoutSession({ request, response }: HttpContext) {
    const { folderId } = request.only(['folderId'])

    if (!folderId) {
      return response.badRequest({ error: 'folderId is required' })
    }

    const detection = await LeakDetection.findBy('folderId', folderId)

    if (!detection) {
      return response.notFound({ error: 'Dossier introuvable' })
    }

    if (detection.paymentStatus === 'paid') {
      return response.conflict({ error: 'Ce dossier a déjà été réglé' })
    }

    const frontendUrl = env.get('FRONTEND_URL')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: folderId,
      customer_email: detection.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 25000,
            product_data: {
              name: 'Recherche de fuite — Détection non destructive',
              description: `Dossier ${folderId.slice(0, 8)}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/recherche-de-fuite/confirmation?folder_id=${folderId}`,
      cancel_url: `${frontendUrl}/recherche-de-fuite?step=3&folder_id=${folderId}`,
    })

    detection.stripeCheckoutSessionId = session.id
    await detection.save()

    return response.ok({ url: session.url })
  }

  /**
   * POST /api/v1/webhooks/stripe
   */
  async handleWebhook({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')

    if (!signature) {
      return response.badRequest({ error: 'Missing stripe-signature header' })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        request.raw() as string,
        signature,
        env.get('STRIPE_WEBHOOK_SECRET')
      )
    } catch {
      return response.badRequest({ error: 'Invalid webhook signature' })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const folderId = session.client_reference_id

      if (folderId) {
        const detection = await LeakDetection.findBy('folderId', folderId)

        if (detection) {
          detection.paymentStatus = 'paid'
          detection.status = 'paid'
          detection.stripePaymentIntentId = session.payment_intent as string
          detection.amountCents = session.amount_total ?? 25000
          await detection.save()

          try {
            await mail.send(new PaymentReceiptNotification(detection))
          } catch (error) {
            console.error('Failed to send payment receipt:', error)
          }
        }
      }
    }

    return response.ok({ received: true })
  }
}
