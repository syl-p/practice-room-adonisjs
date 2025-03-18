import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import GoalLabels from '#enums/goal_labels'

export default class Goal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare exerciseId: number

  @column()
  declare goal: number

  @column()
  declare step: number

  @column()
  declare label: GoalLabels

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
