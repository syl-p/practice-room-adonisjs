import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import { activityValidator } from '#validators/activity'
import type Goal from '#models/goal'
import Tag from '#models/tag'
import { dd } from '@adonisjs/core/services/dumper'
import TaggableType from '#enums/taggable_type'

export default class ActivitiesController {
  async index({ view }: HttpContext) {
    const activities = await Activity.query()
      .preload('user')
      .preload('tags')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')

    return view.render('pages/activities/index', { activities })
  }

  async show({ view, params, auth, bouncer, response }: HttpContext) {
    const activity = await Activity.findByOrFail('slug', params.slug)
    if (await bouncer.with('ActivityPolicy').denies('show', activity)) {
      return response.redirect().toRoute('home')
    }

    await activity.load('user')
    await activity.load('tags')
    await activity.load('media')
    await activity.load('goal')
    let progression: Goal | undefined | null

    if (auth.isAuthenticated) {
      const user = auth.use('web').user
      await user?.load('favorites')

      progression = await user
        ?.related('progressions')
        .query()
        .where('activity_id', activity.id)
        .first()
    }

    return view.render('pages/activities/show', { activity, progression })
  }

  async create({ view, auth }: HttpContext) {
    await auth.user?.load('media')
    return view.render('pages/activities/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const { title, content, status, media, tags } = await request.validateUsing(activityValidator)
    const activity = new Activity()
    activity.merge({ title, content, status })
    await auth.user?.related('activities').save(activity)

    if (media) {
      await activity.related('media').attach(typeof media === 'number' ? [media] : media)
    }

    if (tags) {
      const tagsEntities = await Tag.query().whereIn('label', tags)

      // Attach tags to the activity
      const tagsToAttach = tagsEntities.map(({ id }) => [
        id,
        { taggable_type: TaggableType.ACTIVITY },
      ])

      await activity.related('tags').detach()
      await activity.related('tags').attach(Object.fromEntries(tagsToAttach))
    }

    return response.redirect().toRoute('activity.show', { slug: activity.slug })
  }

  async edit({ view, params, response, bouncer, auth }: HttpContext) {
    const activity = await Activity.findOrFail(params.id)
    if (await bouncer.with('ActivityPolicy').denies('edit', activity)) {
      return response.forbidden('Cannot edit this activity')
    }

    await auth.user?.load('media')
    await activity.load('media')
    await activity.load('tags')
    await activity.load('goal')

    return view.render('pages/activities/edit', { activity })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    const activity = await Activity.findOrFail(params.id)
    if (await bouncer.with('ActivityPolicy').denies('edit', activity)) {
      return response.forbidden('Cannot edit this activity')
    }

    const { title, content, status, media, tags } = await request.validateUsing(activityValidator)
    activity.merge({ title, content, status })

    await activity.related('media').detach()
    if (media) {
      await activity.related('media').attach(typeof media === 'number' ? [media] : media)
    }

    if (tags) {
      const tagsEntities = await Tag.query().whereIn('label', tags)

      // Attach tags to the activity
      const tagsToAttach = tagsEntities.map(({ id }) => [
        id,
        { taggable_type: TaggableType.ACTIVITY },
      ])

      await activity.related('tags').detach()
      await activity.related('tags').attach(Object.fromEntries(tagsToAttach))
    }

    await activity.load('tags')

    await activity.save()
    return response.redirect().toRoute('activities.edit', { id: activity.id })
  }

  async destroy({ response, params, bouncer }: HttpContext) {
    const activity = await Activity.findOrFail(params.id)
    if (await bouncer.with('ActivityPolicy').denies('delete', activity)) {
      return response.forbidden('Cannot delete this activity')
    }

    await activity.delete()
    return response.redirect().toRoute('activities.index')
  }
}
