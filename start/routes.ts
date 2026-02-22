/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const QuotesController = () => import('#controllers/quotes_controller')
const LeakDetectionsController = () => import('#controllers/leak_detections_controller')
const ContactsController = () => import('#controllers/contacts_controller')
const RealisationsController = () => import('#controllers/realisations_controller')
const CitiesController = () => import('#controllers/cities_controller')
const UploadsController = () => import('#controllers/uploads_controller')
const StripeController = () => import('#controllers/stripe_controller')
const AppointmentsController = () => import('#controllers/appointments_controller')
const AuthController = () => import('#controllers/auth_controller')

// Health check
router.get('/', async () => {
  return { status: 'ok', name: 'Makria API' }
})

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Quote requests — public create
    router.post('/quotes', [QuotesController, 'store'])

    // Leak detections — public create
    router.post('/leak-detections', [LeakDetectionsController, 'store'])

    // Contact messages — public create
    router.post('/contacts', [ContactsController, 'store'])

    // File uploads — public
    router.post('/uploads', [UploadsController, 'store'])

    // Stripe — create checkout session
    router.post('/stripe/create-checkout-session', [StripeController, 'createCheckoutSession'])

    // Realisations — public read
    router.get('/realisations', [RealisationsController, 'index'])
    router.get('/realisations/:slug', [RealisationsController, 'show'])

    // Appointments — available slots
    router.get('/appointments/available-slots', [AppointmentsController, 'availableSlots'])

    // City pages — public read
    router.get('/cities', [CitiesController, 'index'])
    router.get('/cities/:slug', [CitiesController, 'show'])
  })
  .prefix('/api/v1')

/*
|--------------------------------------------------------------------------
| Auth routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/api/v1/auth')

/*
|--------------------------------------------------------------------------
| Admin routes (protected)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Quotes management
    router.get('/quotes', [QuotesController, 'index'])
    router.get('/quotes/:id', [QuotesController, 'show'])
    router.put('/quotes/:id', [QuotesController, 'update'])
    router.delete('/quotes/:id', [QuotesController, 'destroy'])

    // Leak detections management
    router.get('/leak-detections', [LeakDetectionsController, 'index'])
    router.get('/leak-detections/:id', [LeakDetectionsController, 'show'])
    router.put('/leak-detections/:id', [LeakDetectionsController, 'update'])
    router.delete('/leak-detections/:id', [LeakDetectionsController, 'destroy'])

    // Contact messages management
    router.get('/contacts', [ContactsController, 'index'])
    router.get('/contacts/:id', [ContactsController, 'show'])
    router.put('/contacts/:id/read', [ContactsController, 'markRead'])
    router.delete('/contacts/:id', [ContactsController, 'destroy'])

    // Realisations management
    router.post('/realisations', [RealisationsController, 'store'])
    router.put('/realisations/:id', [RealisationsController, 'update'])
    router.delete('/realisations/:id', [RealisationsController, 'destroy'])

    // City pages management
    router.post('/cities', [CitiesController, 'store'])
    router.put('/cities/:id', [CitiesController, 'update'])
    router.delete('/cities/:id', [CitiesController, 'destroy'])
  })
  .prefix('/api/v1/admin')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Stripe Webhook
|--------------------------------------------------------------------------
*/
router.post('/api/v1/webhooks/stripe', [StripeController, 'handleWebhook'])
