import { DateTime } from 'luxon'
import {
  afterCreate,
  afterDelete,
  BaseModel,
  beforeCreate,
  beforeUpdate,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import CommentableType from '#enums/commentable_types'
import MentionService from '#services/mention_service'
import CommentService from '#services/comment_service'
import { NotificationService } from '#services/notification_service'
import NotificationType from '#enums/notification_type'

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

  @column()
  declare parentId: number

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  declare replies: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  declare mentions: User[]

  @beforeCreate()
  @beforeUpdate()
  static async parseContent(comment: Comment) {
    // comment.mentions = await MentionService.mentionedUsers(comment.content)
    // comment.content = await MentionService.convertMentionsToLinks(comment.content, comment.mentions)
    // comment.content = CommentService.convertUrlToLink(comment.content)
  }

  @afterCreate()
  static async notifications(comment: Comment) {
    await comment.load('user')

    await NotificationService.do(NotificationType.COMMENT, comment.user, {
      comment: comment.serialize(),
      user: comment.user.serialize(),
      href: '#',
    })

    if (!comment.mentions) return

    await Promise.all(
      comment.mentions.map((user) =>
        NotificationService.do(NotificationType.MENTION, user, { comment: comment.serialize() })
      )
    )
  }

  @afterDelete()
  static async removeChilds(comment: Comment) {
    await comment.related('replies').query().delete()
  }
}
