import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { ExerciseFactory } from './exercise_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      avatarUrl: faker.image.url(),
      password: faker.internet.password(),
    }
  })
  .relation('exercises', () => ExerciseFactory)
  .relation('practicedExercises', () => ExerciseFactory)
  .build()
