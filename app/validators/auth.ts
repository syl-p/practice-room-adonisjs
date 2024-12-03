import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(100),
    email: vine
      .string()
      .email()
      .normalizeEmail({})
      .unique(async (db, value, _field) => {
        const result = await db.from('users').select('id').where('email', value)

        return result.length ? false : true
      }),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({}),
    password: vine.string(),
  })
)
