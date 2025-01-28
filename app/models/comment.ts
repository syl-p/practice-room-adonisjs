import { DateTime } from 'luxon'
import { afterDelete, BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import CommentableType from '#enums/commentable_types'
import MentionService from '#services/mention_service'

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

  @computed()
  get mentions() {
    return MentionService.checkMentions(this.content)
  }

  @computed()
  get contentParsed() {
    const content = MentionService.convertMentionsToLinks(this.content)
    return content
  }

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
