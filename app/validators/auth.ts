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
    isRemberMe: vine.accepted().optional(),
  })
)

const checkEmail = vine.group([
  vine.group.if((data, field) => data.email === field.meta.userEmail, {
    email: vine.string().email(),
  }),
  vine.group.else({
    email: vine
      .string()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
  }),
])

const checkPassword = vine.group([
  vine.group.if((data) => data.password === null, {
    password: vine.string().trim().nullable().optional(),
  }),
  vine.group.else({
    password: vine.string().trim().confirmed(),
  }),
])

export const registerEditValidator = vine.compile(
  vine
    .object({
      username: vine.string().maxLength(100),
      bio: vine.string().trim().optional(),
      avatar: vine.file({ extnames: ['jpg', 'png', 'jped'] }).optional(),
      avatarUrl: vine.string().optional(),
    })
    .merge(checkEmail)
    .merge(checkPassword)
)
