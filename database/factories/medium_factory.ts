import factory from '@adonisjs/lucid/factories'
import Medium from '#models/medium'

export const MediumFactory = factory
  .define(Medium, async ({ faker }) => {
    return {
      fileUrl: faker.image.url(),
      description: faker.lorem.sentence(),
      userId: 1,
    }
  })
  .build()
