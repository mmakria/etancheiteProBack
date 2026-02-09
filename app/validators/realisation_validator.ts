import vine from '@vinejs/vine'

export const createRealisationValidator = vine.compile(
  vine.object({
    slug: vine.string().trim().maxLength(200),
    title: vine.string().trim().minLength(3).maxLength(300),
    description: vine.string().trim().minLength(10).maxLength(5000),
    client: vine.string().trim().maxLength(200).optional(),
    location: vine.string().trim().maxLength(300),
    city: vine.string().trim().maxLength(100),
    projectDate: vine.string(),
    duration: vine.string().trim().maxLength(100).optional(),
    surface: vine.string().trim().maxLength(100).optional(),
    pole: vine.enum(['enveloppe', 'amenagement']),
    services: vine.array(vine.string().maxLength(100)),
    featured: vine.boolean().optional(),
    published: vine.boolean().optional(),
    seoTitle: vine.string().trim().maxLength(300).optional(),
    seoDescription: vine.string().trim().maxLength(1000).optional(),
  })
)

export const updateRealisationValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300).optional(),
    description: vine.string().trim().minLength(10).maxLength(5000).optional(),
    client: vine.string().trim().maxLength(200).optional(),
    location: vine.string().trim().maxLength(300).optional(),
    city: vine.string().trim().maxLength(100).optional(),
    projectDate: vine.string().optional(),
    duration: vine.string().trim().maxLength(100).optional(),
    surface: vine.string().trim().maxLength(100).optional(),
    pole: vine.enum(['enveloppe', 'amenagement']).optional(),
    services: vine.array(vine.string().maxLength(100)).optional(),
    featured: vine.boolean().optional(),
    published: vine.boolean().optional(),
    seoTitle: vine.string().trim().maxLength(300).optional(),
    seoDescription: vine.string().trim().maxLength(1000).optional(),
  })
)
