import ExerciseStatuses from '#enums/exercise_statuses'
import vine from '@vinejs/vine'

const mediaType = vine.union([
  vine.union.if((value) => vine.helpers.isNumeric(value), vine.number().positive().optional()),
  vine.union.else(vine.array(vine.number().positive()).optional()),
])

export const exerciseValidator = vine.compile(
  vine.object({
    title: vine.string().trim().notSameAs('').minLength(1),
    content: vine.string().trim().notSameAs('').minLength(1),
    status: vine.enum(ExerciseStatuses),
    media: mediaType,
  })
)
