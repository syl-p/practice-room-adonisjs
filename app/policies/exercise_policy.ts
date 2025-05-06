import User from '#models/user'
import Exercise from '#models/exercise'
import { allowGuest, BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import ExerciseStatuses from '#enums/exercise_statuses'

export default class ExercisePolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  @allowGuest()
  show(user: User | null, exercise: Exercise): AuthorizerResponse {
    if (exercise.status === ExerciseStatuses.PUBLIC) {
      return true
    }

    if (!user) {
      return false
    }

    return user.id === exercise.userId
  }

  edit(user: User, exercise: Exercise): AuthorizerResponse {
    return user.id === exercise.userId
  }

  delete(user: User, exercise: Exercise): AuthorizerResponse {
    return user.id === exercise.userId
  }
}
