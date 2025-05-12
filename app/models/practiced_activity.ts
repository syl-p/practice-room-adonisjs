import { DateTime } from 'luxon'
import { afterCreate, afterDelete, BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Activity from '#models/activity'
import CacheService from '#services/cache_service'
import type { Valid } from 'luxon/src/_util.js'

export default class PracticedActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare duration: number

  @column()
  declare userId: number

  @column()
  declare activityId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Activity)
  declare activity: BelongsTo<typeof Activity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  @afterDelete()
  static async invalidCache(practicedActivity: PracticedActivity) {
    await CacheService.delete(
      `practice_time:${practicedActivity.userId}:${DateTime.now().toFormat('yyyy-LL-dd')}`
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
