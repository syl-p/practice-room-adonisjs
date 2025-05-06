import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import Exercise from '#models/exercise'
import Comment from '#models/comment'
import { inject } from '@adonisjs/core'
import CommentableType from '#enums/commentable_types'
import { HttpContext } from '@adonisjs/core/http'

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

  async store(data: { content: string }, commentable: Comment | Exercise) {
    const comment = new Comment()
    comment.merge({
      ...data,
      userId: this.ctx.auth.user!.id,
      commentableType:
        commentable instanceof Comment ? CommentableType.COMMENT : CommentableType.EXERCISE,
    })

    if (commentable instanceof Comment) {
      await commentable.related('replies').save(comment)
    } else {
      await commentable.related('comments').save(comment)
    }

    await comment.load('user')
  }

  // TODO: Keep notification for comment reply ? Hmm I don't know
  async notificationForAuthor(commentable: Comment | Exercise, author: User) {
    const channel = 'user/' + author.id + '/notifications'
    let slug = ''
    if (commentable instanceof Exercise) {
      slug = commentable.slug
    } else {
      const exercise = await Exercise.findOrFail(commentable.commentableId)
      slug = exercise.slug
    }

    const link = router.makeUrl('exercise.show', {
      slug,
    })

    transmit.broadcast(channel, {
      link,
      type: 'new_comment',
    })
  }
}
