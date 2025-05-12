import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import Activity from '#models/activity'
import { TagFactory } from '#database/factories/tag_factory'
import TaggableType from '#enums/taggable_type'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // USERS
    const defaultUsers = await UserFactory.with('activities', 3, (activity) =>
      activity
        .apply('public')
        .with('goal')
        .with('media', 3)
        .with('comments', 10, (comment) =>
          comment
            .with('user')
            .apply('activity')
            .with('replies', 4, (commentRow) => commentRow.apply('comment'))
        )
    )
      .with('activities', 3, (activity) => activity.apply('draft'))
      .with('activities', 3, (activity) => activity.apply('not referenced'))
      .createMany(3)

    // TAGS
    const tags = await TagFactory.createMany(20)

    // GET ALL EXS
    let activities: Activity[] = []
    for (const user of defaultUsers) {
      await user.load('activities')
      activities = [...activities, ...user.activities]
    }

    const activityIds = activities.map((e) => e.id)
    const userIds = defaultUsers.map((e) => e.id)

    // PROMISES
    const promisesUsers = defaultUsers.map(async (user) => {
      await user.related('followers').attach(this.#getRandom(userIds, 10))
    })

    const promisesTags = tags.map(async (tag) => {
      const ex = this.#getRandom(activityIds, 10).map((id) => [
        id,
        { taggable_type: TaggableType.ACTIVITY },
      ]) // = [3, {taggable_type: 'Activity'}][]

      // attach {3: {taggable_type: 'Activity'}}
      await tag.related('activities').attach(Object.fromEntries(ex))
    })

    await Promise.all([...promisesUsers, ...promisesTags])
  }

  #getRandom<T>(array: T[], pluck: number) {
    const shuffle = array.sort(() => 0.5 - Math.random())
    return shuffle.slice(0, pluck)
  }
}
