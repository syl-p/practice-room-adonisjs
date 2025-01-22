import vine from '@vinejs/vine'

export const searchValidator = vine.compile(
  vine.object({
    pattern: vine.string().trim().optional().nullable(),
  })
)
