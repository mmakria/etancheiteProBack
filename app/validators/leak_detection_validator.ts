import vine from '@vinejs/vine'

export const createLeakDetectionValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().maxLength(254),
    phone: vine.string().trim().minLength(10).maxLength(20),
    address: vine.string().trim().minLength(5).maxLength(300),
    city: vine.string().trim().minLength(2).maxLength(100).optional(),
    postalCode: vine.string().trim().regex(/^\d{5}$/).optional(),
    leakType: vine.enum(['roof', 'terrace', 'wall', 'basement', 'other']),
    severity: vine.enum(['minor', 'moderate', 'severe', 'emergency']),
    description: vine.string().trim().maxLength(3000).optional(),
    photoPaths: vine.array(vine.string().maxLength(500)).maxLength(2).optional(),
    folderId: vine.string().uuid().optional(),
    calendlyEventUri: vine.string().maxLength(500).optional(),
  })
)

export const updateLeakDetectionValidator = vine.compile(
  vine.object({
    status: vine.enum(['submitted', 'appointment_scheduled', 'paid', 'completed', 'cancelled']).optional(),
    appointmentDate: vine.string().optional(),
    assignedTo: vine.number().positive().optional(),
    calendlyEventId: vine.string().maxLength(200).optional(),
    stripePaymentIntentId: vine.string().maxLength(200).optional(),
    paymentStatus: vine.enum(['pending', 'paid', 'refunded', 'failed']).optional(),
    amountCents: vine.number().positive().optional(),
  })
)
