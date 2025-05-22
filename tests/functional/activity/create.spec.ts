import ActivityStatuses from '#enums/activity_statuses'
import Activity from '#models/activity'
import { test } from '@japa/runner'

test.group('Activity create', () => {
  test('slug must be generated', async ({ assert }) => {
    const activity = await Activity.create({
      title: 'Functional test',
      content: 'Functional test',
      status: ActivityStatuses.PUBLIC,
      userId: 1,
    })

    assert.isNotNull(activity.slug)
    assert.equal(activity.slug, 'functional-test')
  })
})
