import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import ExerciseStatuses from '#enums/exercise_statuses'
import stringHelpers from '@adonisjs/core/helpers/string'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import ExerciseStatus from './exercise_status.js'

export default class Exercise extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare slug: string

  @column()
  declare posterUrl: string | null

  @column()
  declare statusId: number

  @belongsTo(() => ExerciseStatus, {
    foreignKey: 'statusId',
  })
  declare status: BelongsTo<typeof ExerciseStatus>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'practiced_exercises',
    pivotForeignKey: 'exercise_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['duration'],
    pivotTimestamps: true,
  })
  declare practicedBy: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async makeSlug(exercise: Exercise) {
    if (exercise.slug) return
    const slug = stringHelpers.slug(exercise.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Exercise.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (rows.length < 1) {
      exercise.slug = slug
      return
    }

    // DUPLICATION ? go increment
    const increments = rows.reduce<number[]>((results, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2) {
        return results
      }

      const token = Number(tokens.at(1))

      if (!Number.isNaN(token)) {
        results.push(token)
      }

      return results
    }, [])

    const increment = increments.length ? Math.max(...increments) : 1
    exercise.slug = `${slug}-${increment}`
    return
  }

  static public = scope((query) => {
    query.where('statusId', ExerciseStatuses.PUBLIC)
  })

  static draft = scope((query) => {
    query.where('statusId', ExerciseStatuses.DRAFT)
  })

  static private = scope((query) => {
    query.where('statusId', ExerciseStatuses.NOT_REFERENCED)
  })
}
