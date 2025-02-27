import factory from '@adonisjs/lucid/factories'
import Exercise from '#models/exercise'
import ExerciseStatuses from '#enums/exercise_statuses'
import { UserFactory } from './user_factory.js'
import { TagFactory } from './tag_factory.js'
import { CommentFactory } from './comment_factory.js'
import { MediumFactory } from './medium_factory.js'

export const ExerciseFactory = factory
  .define(Exercise, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      posterUrl: faker.image.url(),
      statusId: ExerciseStatuses.PUBLIC,
      userId: 1,
    }
  })
  .relation('user', () => UserFactory)
  .relation('tags', () => TagFactory)
  .relation('media', () => MediumFactory)
  .relation('comments', () => CommentFactory)
  .state('public', (row) => {
    row.statusId = ExerciseStatuses.PUBLIC
  })
  .state('draft', (row) => {
    row.statusId = ExerciseStatuses.DRAFT
  })
  .state('not referenced', (row) => {
    row.statusId = ExerciseStatuses.NOT_REFERENCED
  })
  .build()
