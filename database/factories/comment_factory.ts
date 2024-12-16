import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from './user_factory.js'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
      userId: 1,
    }
  })
  .relation('user', () => UserFactory)
  .state('exercise', (row) => {
    row.commentableType = 'Exercise'
  })
  .build()
