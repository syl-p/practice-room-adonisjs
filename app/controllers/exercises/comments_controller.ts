// import type { HttpContext } from '@adonisjs/core/http'

import Comment from '#models/comment'
import Exercise from '#models/exercise'
import { newCommentValidator } from '#validators/comment'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { STATUS_CODES } from 'node:http'

export default class CommentsController {
  async index({ params }: HttpContext) {
    const comments = await Comment.query()
      .where('commentableId', params.exercise_id)
      .andWhere('commentableType', 'Exercise')
      .orderBy('createdAt', 'desc')

    return comments
  }

  async store({ request, params, auth, view, session, response }: HttpContext) {
    const exercise = await Exercise.findByOrFail({ id: params.exercise_id })
    const comment = new Comment()

    if (auth.user) comment.userId = auth.user?.id
    comment.commentableType = 'Exercise'
    comment.commentableId = params.exercise_id

    try {
      const data = await request.validateUsing(newCommentValidator)
      comment.merge(data)
      await exercise.related('comments').create(comment)
      await comment.load('user')
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        session.flashValidationErrors(error)
        response.status(500)
      }
    }

    return view.render('fragments/comment', { comment })
  }
}
