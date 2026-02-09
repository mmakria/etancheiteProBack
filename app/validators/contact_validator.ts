import vine from '@vinejs/vine'

export const createContactValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().maxLength(254),
    phone: vine.string().trim().maxLength(20).optional(),
    subject: vine.string().trim().minLength(3).maxLength(300),
    message: vine.string().trim().minLength(10).maxLength(5000),
  })
)
