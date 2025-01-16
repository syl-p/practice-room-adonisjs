import { DateTime } from 'luxon'
import { afterDelete, BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import CommentableType from '#enums/commentable_types'

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
  declare commentableType: CommentableType

  /*  @computed()
  get relatedEntity() {
    const ModelClass = this.getModelClass(this.commentableType)
    return ModelClass[this.commentableType]
  }

  private getModelClass(type: string) {
    const models = {
      Exercise: () => import('#models/exercise'),
      Comment: () => import('#models/comment'),
    }

    //@ts-ignore
    return models[type]?.().then((module) => module.default)
  }*/

  @hasMany(() => Comment, {
    foreignKey: 'commentableId',
    onQuery: (query) => query.where('commentable_type', CommentableType.COMMENT),
  })
  declare replies: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterDelete()
  static async removeChilds(comment: Comment) {
    await comment.related('replies').query().delete()
  }
}
