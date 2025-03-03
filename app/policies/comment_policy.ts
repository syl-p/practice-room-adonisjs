import User from '#models/user'
import Comment from '#models/comment'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CommentPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  edit(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId
  }

  delete(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId
  }
}
