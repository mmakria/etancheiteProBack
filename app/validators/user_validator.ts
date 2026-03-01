import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().maxLength(254),
    fullName: vine.string().trim().minLength(2).maxLength(100),
    password: vine.string().minLength(8).maxLength(128),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100).optional(),
    password: vine.string().minLength(8).maxLength(128).optional(),
  })
)
