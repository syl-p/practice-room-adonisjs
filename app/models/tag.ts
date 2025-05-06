import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Exercise from './exercise.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Practice from './practice.js'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare label: string

  @manyToMany(() => Exercise, {
    pivotTable: 'tag_taggable',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'taggable_id',
    // pivotTimestamps: true,
  })
  declare exercises: ManyToMany<typeof Exercise>

  @manyToMany(() => Practice, {
    pivotTable: 'tag_taggable',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'taggable_id',
    // pivotTimestamps: true,
  })
  declare practices: ManyToMany<typeof Practice>
}
