import { DateTime } from 'luxon'
import { afterCreate, afterDelete, BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Exercise from '#models/exercise'
import CacheService from '#services/cache_service'
import type { Valid } from 'luxon/src/_util.js'

export default class PracticedExercise extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare duration: number

  @column()
  declare userId: number

  @column()
  declare exerciseId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  @afterDelete()
  static async invalidCache(practicedExercise: PracticedExercise) {
    await CacheService.delete(
      `practice_time:${practicedExercise.userId}:${DateTime.now().toFormat('yyyy-LL-dd')}`
    )
  }

  static today = scope((query) => {
    query
      .where('createdAt', '>=', DateTime.now().startOf('day').toSQL())
      .andWhere('createdAt', '<=', DateTime.now().endOf('day').toSQL())
  })

  static atSpecificDate = scope((query, date: DateTime<Valid>) => {
    query
      .where('createdAt', '>=', date.startOf('day').toSQL())
      .andWhere('createdAt', '<=', date.endOf('day').toSQL())
  })
}
