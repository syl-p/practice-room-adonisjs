import Comment from '#models/comment'
import { newCommentValidator } from '#validators/comment'
import CommentableType from '#enums/commentable_types'
import { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async store({ params, request, auth, view }: HttpContext) {
    const comment = await Comment.findOrFail(params.comment_id)

    const data = await request.validateUsing(newCommentValidator)
    const reply = new Comment()
    reply.merge({
      ...data,
      userId: auth.user!.id,
      commentableId: comment.id,
      commentableType: CommentableType.COMMENT,
    })

    await comment.related('replies').save(reply)
    await reply.load('user')

    return view.render('fragments/comment', { comment: reply })
  }
}
