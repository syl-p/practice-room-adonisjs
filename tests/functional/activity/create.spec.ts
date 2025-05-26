import { ActivityFactory } from '#database/factories/activity_factory'
import { UserFactory } from '#database/factories/user_factory'
import ActivityStatuses from '#enums/activity_statuses'
import Activity from '#models/activity'
import { test } from '@japa/runner'

test.group('Activity create', () => {
  test('slug must be generated', async ({ assert }) => {
    const user = await UserFactory.create()
    const activity = await Activity.create({
      title: 'Functional test',
      content: 'Functional test',
      status: ActivityStatuses.PUBLIC,
      userId: user.id,
    })

    assert.isNotNull(activity.slug)
  })

  test('slug must be unique', async ({ assert }) => {
    const activity1 = await ActivityFactory.create()
    const activity2 = await ActivityFactory.create()

    assert.isNotNull(activity1.slug)
    assert.isNotNull(activity2.slug)
    assert.notEqual(activity1.slug, activity2.slug)
  })
})
