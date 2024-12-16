import factory from '@adonisjs/lucid/factories'
import Tag from '#models/tag'

export const TagFactory = factory
  .define(Tag, async ({ faker }) => {
    return {
      label: faker.lorem.words({ min: 1, max: 2 }),
    }
  })
  .state('exercise', (row) => {
    row.taggableType = 'Exercise'
  })
  .build()
