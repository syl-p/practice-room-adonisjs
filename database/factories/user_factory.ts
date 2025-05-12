import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { ActivityFactory } from './activity_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      username: faker.internet.username(),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      avatarUrl: faker.image.url(),
      password: faker.internet.password(),
    }
  })
  .relation('activities', () => ActivityFactory)
  .relation('practicedActivities', () => ActivityFactory)
  .build()
