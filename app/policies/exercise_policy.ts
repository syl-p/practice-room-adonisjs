import User from '#models/user'
import Exercise from '#models/exercise'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import ExerciseStatuses from '#enums/exercise_statuses'

export default class ExercisePolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  show(user: User, exercise: Exercise): AuthorizerResponse {
    return user.id === exercise.userId || exercise.status === ExerciseStatuses.PUBLIC
  }

  edit(user: User, exercise: Exercise): AuthorizerResponse {
    return user.id === exercise.userId
  }

  delete(user: User, exercise: Exercise): AuthorizerResponse {
    return user.id === exercise.userId
  }
}
