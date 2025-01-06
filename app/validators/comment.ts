import vine from '@vinejs/vine'

export const newCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().notSameAs('').minLength(1),
  })
)
