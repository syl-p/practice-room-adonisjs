import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'
import CommentPolicy from '#policies/comment_policy'

export default class CommentsController {
  async destroy({ params, session, response, bouncer }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with(CommentPolicy).authorize('delete', comment)
    await comment.delete()

    session.flash('success', 'Your comment has been deleted')
    return response.redirect().back()
  }
}
