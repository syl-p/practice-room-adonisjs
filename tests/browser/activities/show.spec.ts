import { ActivityFactory } from '#database/factories/activity_factory'
import { test } from '@japa/runner'

test.group('Activities show', () => {
  test('public activity have a show page', async ({ visit }) => {
    const activity = await ActivityFactory.with('user').create()
    await visit('/activities/' + activity.id)
  })

  test('draft activity cannot be visited', async ({ visit }) => {
    const activity = await ActivityFactory.with('user').apply('draft').create()
    const response = await visit('/activities/' + activity.slug)
    await response.assertPath('/')
  })

  test('draft activity can be visited by owner', async ({ visit, browserContext }) => {
    const activity = await ActivityFactory.with('user').apply('draft').create()
    await activity.load('user')

    await browserContext.loginAs(activity.user)

    const response = await visit('/activities/' + activity.slug)
    await response.assertPath('/activities/' + activity.slug)
  })
})
