import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import Exercise from '#models/exercise'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    const defaultUsers = await UserFactory.with('exercises', 3, (exercise) =>
      exercise.apply('public')
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
    const promises = defaultUsers.map(async (user) => {
      return user.related('practicedExercises').attach(this.#getRandom(exIds, 10))
    })

    await Promise.all(promises)
  }

  #getRandom<T>(array: T[], pluck: number) {
    const shuffle = array.sort(() => 0.5 - Math.random())
    return shuffle.slice(0, pluck)
  }
}
