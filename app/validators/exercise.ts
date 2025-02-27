import vine from '@vinejs/vine'

export const exerciseValidator = vine.compile(
  vine.object({
    title: vine.string().trim().notSameAs('').minLength(1),
    content: vine.string().trim().notSameAs('').minLength(1),
  })
)
