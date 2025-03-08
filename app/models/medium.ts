import { DateTime } from 'luxon'
import { afterDelete, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'

export default class Medium extends BaseModel {
  static table = 'media'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fileUrl: string

  @column()
  declare description: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterDelete()
  static async deleteFile(medium: Medium) {
    const file = app.makePath(`storage/${medium.fileUrl}`)
    await fs.access(file)
    await fs.unlink(file)
  }
}
