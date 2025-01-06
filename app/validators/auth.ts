import User from '#models/user'
import { uniqueRule } from '#start/rules/unique'
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(100),
    email: vine
      .string()
      .email()
      .normalizeEmail({})
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().minLength(8).confirmed(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({}),
    password: vine.string(),
  })
)

export const registerEditValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(100),
    email: vine
      .string()
      .email()
      .normalizeEmail({})
      .optional()
      .use(uniqueRule({ table: 'users', column: 'email' })),
  })
)
