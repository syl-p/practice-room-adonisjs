import Comment from '#models/comment'
import Exercise from '#models/exercise'
import { newCommentValidator } from '#validators/comment'
import { HttpContext } from '@adonisjs/core/http'
import CommentableType from '#enums/commentable_types'

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
    const exercise = await Exercise.findByOrFail({ id: params.exercise_id })

    const data = await request.validateUsing(newCommentValidator)
    const comment = new Comment()
    comment.merge({
      ...data,
      userId: auth.user!.id,
      commentableId: comment.id,
      commentableType: CommentableType.EXERCISE,
    })

    await exercise.related('comments').save(comment)
    await comment.load('user')

    return view.render('fragments/comment', { comment, exercise_id: params.exercise_id })
  }
}
