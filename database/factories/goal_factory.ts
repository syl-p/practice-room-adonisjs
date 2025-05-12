import factory from '@adonisjs/lucid/factories'
import Goal from '#models/goal'
import GoalLabels from '#enums/goal_labels'

export const GoalFactory = factory
  .define(Goal, async ({ faker }) => {
    return {
      objective: 100,
      step: 10,
      label: GoalLabels.POURCENT,
      activity_id: 1,
    }
  })
  .build()
