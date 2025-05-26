import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'
import CommentPolicy from '#policies/comment_policy'
import { newCommentValidator } from '#validators/comment'
import CommentableType from '#enums/commentable_types'
import Activity from '#models/activity'
import CommentService from '#services/comment_service'
import { inject } from '@adonisjs/core'

// TODO: Not use "Activity" model direcly use comment.commentableType to query comments
@inject()
export default class CommentsController {
  constructor(private commentService: CommentService) {}

  async index({ params, view }: HttpContext) {
    const comments = await Comment.query()
      .preload('user')
      .preload('replies', (query) => {
        query.preload('user')
        query.orderBy('createdAt', 'asc')
      })
      .where('commentableId', params.activity_id)
      .andWhere('commentableType', CommentableType.ACTIVITY)
      .orderBy('createdAt', 'desc')

    return view.render('fragments/comments', { comments })
  }

  async store({ request, params, view }: HttpContext) {
    const data = await request.validateUsing(newCommentValidator)
    const commentable = await this.getCommentable(params)

    const comment = await this.commentService.store(data, commentable)

    return view.render('fragments/comment', {
      comment,
      controller_name: commentable instanceof Comment ? 'comments' : 'activities',
      params: {
        ...(commentable instanceof Comment && { comment_id: comment.id }),
        ...(commentable instanceof Activity && { activity_id: commentable.id }),
      },
    })
  }

  private async getCommentable(params: any): Promise<Activity | Comment> {
    if (params.comment_id !== undefined) {
      return await Comment.findOrFail(params.comment_id)
    }
    return await Activity.findOrFail(params.activity_id)
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

    return view.render('fragments/comment', {
      comment,
      controller_name: 'comments',
      params: {
        comment_id: comment.id,
      },
    })
  }

  async destroy({ params, session, response, bouncer }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with(CommentPolicy).authorize('delete', comment)
    await comment.delete()

    session.flash('success', 'Your comment has been deleted')
    return response.redirect().back()
  }
}
