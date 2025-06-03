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
    const user = await UserFactory.create()
    const activity1 = new Activity()
    activity1.merge({
      title: 'my title !',
      content: 'test content',
      userId: user.id,
    })
    await activity1.save()

    const activity2 = new Activity()
    activity2.merge({
      title: 'my title !',
      content: 'test content',
      userId: user.id,
    })
    await activity2.save()

    assert.isNotNull(activity1.slug)
    assert.isNotNull(activity2.slug)
    assert.notEqual(activity1.slug, activity2.slug)
  })
})
