import User from '#models/user'
import Comment from '#models/comment'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CommentPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return true
  }

  /**
   * Only the post creator can edit the post
   */
  edit(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId
  }

  /**
   * Only the post creator can delete the post
   */
  delete(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId
  }
}
