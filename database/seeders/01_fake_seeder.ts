import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import Exercise from '#models/exercise'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const defaultUsers = await UserFactory.with('exercises', 3, (exercise) =>
      exercise
        .apply('public')
        .with('comments', 10, (comment) => comment.with('user').apply('exercise'))
        .with('tags', 5, (tag) => tag.apply('exercise'))
    )
      // .with('practicedExercises', 10)
      .with('exercises', 3, (exercise) => exercise.apply('draft'))
      .with('exercises', 3, (exercise) => exercise.apply('not referenced'))
      .createMany(3)

    let exercises: Exercise[] = []
    for (const user of defaultUsers) {
      await user.load('exercises')
      exercises = [...exercises, ...user.exercises]
    }

    const exIds = exercises.map((e) => e.id)
    const userOds = defaultUsers.map((e) => e.id)
    const promises = defaultUsers.map(async (user) => {
      await user.related('followers').attach(this.#getRandom(userOds, 10))
      // await user.related('practicedExercises').attach(this.#getRandom(exIds, 10))
    })

    await Promise.all(promises)
  }

  #getRandom<T>(array: T[], pluck: number) {
    const shuffle = array.sort(() => 0.5 - Math.random())
    return shuffle.slice(0, pluck)
  }
}
