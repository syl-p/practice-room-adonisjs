import factory from '@adonisjs/lucid/factories'
import Tag from '#models/tag'
// import TaggableType from '#enums/taggable_type'

export const TagFactory = factory
  .define(Tag, async ({ faker }) => {
    return {
      label: faker.lorem.words({ min: 1, max: 2 }),
    }
  })
  // .state('activity', (row) => {
  //   row.taggableType = TaggableType.ACTIVITY
  // })
  .build()
