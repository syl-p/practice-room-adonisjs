import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from './user_factory.js'
import CommentableType from '#enums/commentable_types'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
      userId: 1,
    }
  })
  .relation('user', () => UserFactory)
  .relation('replies', () => CommentFactory)
  .state('exercise', (row) => {
    row.commentableType = CommentableType.EXERCISE
  })
  .state('comment', (row) => {
    row.commentableType = CommentableType.COMMENT
  })
  .build()
