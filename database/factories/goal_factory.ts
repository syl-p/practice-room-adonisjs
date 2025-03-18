import factory from '@adonisjs/lucid/factories'
import Goal from '#models/goal'
import GoalLabels from '#enums/goal_labels'

export const GoalFactory = factory
  .define(Goal, async ({ faker }) => {
    return {
      goal: 100,
      step: 10,
      label: GoalLabels.POURCENT,
      exercise_id: 1,
    }
  })
  .build()
