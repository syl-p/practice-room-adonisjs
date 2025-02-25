import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'
import CommentPolicy from '#policies/comment_policy'
import { newCommentValidator } from '#validators/comment'

export default class CommentsController {
  async edit({ params, view }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    return view.render('components/comments/edit', { comment })
  }

  async update({ params, request, view }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    const data = await request.validateUsing(newCommentValidator)
    comment.merge(data)
    await comment.save()
    await comment.load('user')

    return view.render('fragments/comment', { comment })
  }

  async destroy({ params, session, response, bouncer }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with(CommentPolicy).authorize('delete', comment)
    await comment.delete()

    session.flash('success', 'Your comment has been deleted')
    return response.redirect().back()
  }
}
