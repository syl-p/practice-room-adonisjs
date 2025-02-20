import vine from '@vinejs/vine'

export const practiceTimeValidator = vine.compile(
  vine.object({
    duration: vine.number().min(1),
  })
)

export const practiceByDateValidator = vine.compile(
  vine.object({
    date: vine.date(),
  })
)
