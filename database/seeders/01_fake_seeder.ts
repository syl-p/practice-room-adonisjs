import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import Exercise from '#models/exercise'
import { TagFactory } from '#database/factories/tag_factory'
import TaggableType from '#enums/taggable_type'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // USERS
    const defaultUsers = await UserFactory.with('exercises', 3, (exercise) =>
      exercise
        .apply('public')
        .with('goal')
        .with('media', 3)
        .with('comments', 10, (comment) =>
          comment
            .with('user')
            .apply('exercise')
            .with('replies', 4, (commentRow) => commentRow.apply('comment'))
        )
    )
      .with('exercises', 3, (exercise) => exercise.apply('draft'))
      .with('exercises', 3, (exercise) => exercise.apply('not referenced'))
      .createMany(3)

    // TAGS
    const tags = await TagFactory.createMany(20)

    // GET ALL EXS
    let exercises: Exercise[] = []
    for (const user of defaultUsers) {
      await user.load('exercises')
      exercises = [...exercises, ...user.exercises]
    }

    const exerciseIds = exercises.map((e) => e.id)
    const userIds = defaultUsers.map((e) => e.id)

    // PROMISES
    const promisesUsers = defaultUsers.map(async (user) => {
      await user.related('followers').attach(this.#getRandom(userIds, 10))
    })

    const promisesTags = tags.map(async (tag) => {
      const ex = this.#getRandom(exerciseIds, 10).map((id) => [
        id,
        { taggable_type: TaggableType.EXERCISE },
      ]) // = [3, {taggable_type: 'Exercise'}][]

      // attach {3: {taggable_type: 'Exercise'}}
      await tag.related('exercises').attach(Object.fromEntries(ex))
    })

    await Promise.all([...promisesUsers, ...promisesTags])
  }

  #getRandom<T>(array: T[], pluck: number) {
    const shuffle = array.sort(() => 0.5 - Math.random())
    return shuffle.slice(0, pluck)
  }
}
