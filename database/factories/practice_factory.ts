import factory from '@adonisjs/lucid/factories'
import Practice from '#models/practice'

export const PracticeFactory = factory
  .define(Practice, async ({ faker }) => {
    return {
      title: faker.lorem.sentence({ min: 3, max: 10 }),
      description: faker.lorem.paragraph(),
      userId: 1,
    }
  })
  .build()
