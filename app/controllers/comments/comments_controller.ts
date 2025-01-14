// import type { HttpContext } from '@adonisjs/core/http'

import Comment from '#models/comment'
import { newCommentValidator } from '#validators/comment'
import CommentableType from '#enums/commentable_types'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class CommentsController {
  async store({ params, request, auth, view, response, session }: HttpContext) {
    const comment = await Comment.findOrFail(params.comment_id)
    const reply = new Comment()
    reply.userId = auth.user!.id
    reply.commentableId = comment.id
    reply.commentableType = CommentableType.COMMENT

    try {
      const data = await request.validateUsing(newCommentValidator)
      reply.merge(data)
      await comment.related('replies').save(reply)
      await reply.load('user')
    } catch (error) {
      // HTMX RESP
      if (error instanceof errors.E_VALIDATION_ERROR) {
        session.flashValidationErrors(error)
        response.status(422)
      }
    }

    return view.render('fragments/comment', { comment: reply })
  }
}
