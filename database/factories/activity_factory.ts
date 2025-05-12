import factory from '@adonisjs/lucid/factories'
import Activity from '#models/activity'
import ActivityStatuses from '#enums/activity_statuses'
import { UserFactory } from './user_factory.js'
import { CommentFactory } from './comment_factory.js'
import { MediumFactory } from './medium_factory.js'
import { GoalFactory } from './goal_factory.js'

export const ActivityFactory = factory
  .define(Activity, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      posterUrl: faker.image.url(),
      status: ActivityStatuses.PUBLIC,
      userId: 1,
    }
  })
  .relation('goal', () => GoalFactory)
  .relation('user', () => UserFactory)
  .relation('media', () => MediumFactory)
  .relation('comments', () => CommentFactory)
  .state('public', (row) => {
    row.status = ActivityStatuses.PUBLIC
  })
  .state('draft', (row) => {
    row.status = ActivityStatuses.DRAFT
  })
  .state('not referenced', (row) => {
    row.status = ActivityStatuses.NOT_REFERENCED
  })
  .build()
