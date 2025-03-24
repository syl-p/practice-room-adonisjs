import vine from '@vinejs/vine'

export const progressionValidator = vine.compile(
  vine.object({
    value: vine.number().min(1),
  })
)
