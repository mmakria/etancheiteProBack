import vine from '@vinejs/vine'

export const createQuoteValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().maxLength(254),
    phone: vine.string().trim().minLength(10).maxLength(20),
    company: vine.string().trim().maxLength(200).optional(),
    serviceType: vine.string().trim().maxLength(100),
    pole: vine.enum(['enveloppe', 'amenagement']),
    projectDescription: vine.string().trim().minLength(10).maxLength(5000),
    projectAddress: vine.string().trim().maxLength(300).optional(),
    projectCity: vine.string().trim().maxLength(100).optional(),
    projectPostalCode: vine.string().trim().regex(/^\d{5}$/).optional(),
    preferredContactMethod: vine.enum(['phone', 'email', 'both']).optional(),
    budget: vine.enum(['less_5k', '5k_15k', '15k_30k', '30k_50k', '50k_100k', 'more_100k']).optional(),
    urgency: vine.enum(['low', 'medium', 'high', 'urgent']).optional(),
    photoPaths: vine.array(vine.string().maxLength(500)).maxLength(10).optional(),
  })
)

export const updateQuoteValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'contacted', 'quoted', 'accepted', 'rejected']).optional(),
    internalNotes: vine.string().trim().maxLength(5000).optional(),
  })
)
