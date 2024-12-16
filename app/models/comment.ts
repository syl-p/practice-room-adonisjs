import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare commentableId: number

  @column()
  declare commentableType: string

  @computed()
  get relatedEntity() {
    const ModelClass = this.getModelClass(this.commentableType)
    return ModelClass[this.commentableType]
  }

  private getModelClass(type: string) {
    const models = {
      Exercise: () => import('#models/exercise'),
    }

    return models[type]?.().then((module) => module.default)
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
