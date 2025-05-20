import Activity from '#models/activity'
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
}
