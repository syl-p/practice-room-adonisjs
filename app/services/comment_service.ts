import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import Activity from '#models/activity'
import Comment from '#models/comment'
import { inject } from '@adonisjs/core'
import CommentableType from '#enums/commentable_types'
import { HttpContext } from '@adonisjs/core/http'
import edge from 'edge.js'

@inject()
export default class CommentService {
  constructor(private ctx: HttpContext) {}

  static convertUrlToLink(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    )
  }

  async store(data: { content: string }, commentable: Comment | Activity) {
    const comment = new Comment()
    comment.merge({
      ...data,
      userId: this.ctx.auth.user!.id,
      commentableType:
        commentable instanceof Comment ? CommentableType.COMMENT : CommentableType.ACTIVITY,
    })

    if (commentable instanceof Comment) {
      await commentable.related('replies').save(comment)
    } else {
      await commentable.related('comments').save(comment)
    }

    await comment.load('user')

    return comment
  }

  async notificationForAuthor(commentable: Comment | Activity, comment: Comment, author: User) {
    const channel = 'user/' + author.id + '/notifications'
    let slug = ''
    if (commentable instanceof Activity) {
      slug = commentable.slug
    } else {
      const activity = await Activity.findOrFail(commentable.commentableId)
      slug = activity.slug
    }

    await comment.load('user')

    const html = await edge.render('components/notifications/item', {
      href:
        router.makeUrl('activity.show', {
          slug,
        }) +
        '#comment-' +
        comment.id,
      message: 'à posté un commentaire sur une de vos activités',
      user: comment.user,
      createdAt: comment.createdAt,
    })

    transmit.broadcast(channel, {
      html,
    })
  }
}
