import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'
import CommentPolicy from '#policies/comment_policy'
import { newCommentValidator } from '#validators/comment'
import CommentableType from '#enums/commentable_types'
import Exercise from '#models/exercise'

export default class CommentsController {
  async index({ params, view }: HttpContext) {
    const comments = await Comment.query()
      .preload('user')
      .preload('replies', (query) => {
        query.preload('user')
        query.orderBy('createdAt', 'asc')
      })
      .where('commentableId', params.exercise_id)
      .andWhere('commentableType', CommentableType.EXERCISE)
      .orderBy('createdAt', 'desc')

    return view.render('fragments/comments', { comments })
  }

  async store({ request, params, auth, view }: HttpContext) {
    const data = await request.validateUsing(newCommentValidator)

    const commentable = await this.getCommentable(params)

    const comment = new Comment()
    comment.merge({
      ...data,
      userId: auth.user!.id,
      commentableType:
        commentable instanceof Comment ? CommentableType.COMMENT : CommentableType.EXERCISE,
    })

    if (commentable instanceof Comment) {
      await commentable.related('replies').save(comment)
    } else {
      await commentable.related('comments').save(comment)
    }

    await comment.load('user')

    return view.render('fragments/comment', { comment })
  }

  private async getCommentable(params: any): Promise<Exercise | Comment> {
    if (params.comment_id !== undefined) {
      return await Comment.findOrFail(params.comment_id)
    }
    return await Exercise.findOrFail(params.exercise_id)
  }

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
