import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Activity from './activity.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare label: string

  @manyToMany(() => Activity, {
    pivotTable: 'tag_taggable',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'taggable_id',
    // pivotTimestamps: true,
  })
  declare activities: ManyToMany<typeof Activity>
}
