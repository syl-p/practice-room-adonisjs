import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Exercise from '#models/exercise'
import CacheService from '#services/cache_service'

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

  @beforeSave()
  static async invalidCache(practicedExercise: PracticedExercise) {
    await CacheService.delete(`practice_time:${practicedExercise.userId}`)
  }

  static today = scope((query) => {
    query
      .where('createdAt', '>=', DateTime.now().startOf('day').toSQL())
      .andWhere('createdAt', '<=', DateTime.now().endOf('day').toSQL())
  })
}
