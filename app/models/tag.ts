import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare label: string

  @column()
  declare taggableType: string

  @column()
  declare taggableId: number

  @computed()
  get relatedEntity() {
    const ModelClass = this.getModelClass(this.taggableType)
    return ModelClass[this.taggableType]
  }

  private getModelClass(type: string) {
    const models = {
      Exercise: () => import('#models/exercise'),
    }

    return models[type]?.().then((module) => module.default)
  }
}
