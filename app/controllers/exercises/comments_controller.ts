import Comment from '#models/comment'
import Exercise from '#models/exercise'
import { newCommentValidator } from '#validators/comment'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class CommentsController {
  async index({ params, view }: HttpContext) {
    const comments = await Comment.query()
      .preload('user')
      .where('commentableId', params.exercise_id)
      .andWhere('commentableType', 'Exercise')
      .orderBy('createdAt', 'desc')

    return view.render('fragments/comments', { comments })
  }

  async store({ request, params, auth, view, session, response }: HttpContext) {
    const exercise = await Exercise.findByOrFail({ id: params.exercise_id })
    let comment = new Comment()
    comment.userId = auth.user!.id
    comment.commentableType = 'Exercise'
    comment.commentableId = params.exercise_id

    try {
      const data = await request.validateUsing(newCommentValidator)
      comment.merge(data)
      await exercise.related('comments').save(comment)
      await comment.load('user')
    } catch (error) {
      // HTMX RESP
      if (error instanceof errors.E_VALIDATION_ERROR) {
        session.flashValidationErrors(error)
        response.status(422)
      }
    }

    return view.render('fragments/comment', { comment })
  }
}
