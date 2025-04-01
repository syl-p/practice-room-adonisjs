import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { exerciseValidator } from '#validators/exercise'
import type Goal from '#models/goal'
import Tag from '#models/tag'
import { dd } from '@adonisjs/core/services/dumper'
import TaggableType from '#enums/taggable_type'

export default class ExercisesController {
  async index({ view }: HttpContext) {
    const exercises = await Exercise.query()
      .preload('user')
      .preload('tags')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')

    return view.render('pages/exercises/index', { exercises })
  }

  async show({ view, params, auth, bouncer, response }: HttpContext) {
    const exercise = await Exercise.findByOrFail('slug', params.slug)
    if (await bouncer.with('ExercisePolicy').denies('show', exercise)) {
      return response.redirect().toRoute('exercises.index')
    }

    await exercise.load('user')
    await exercise.load('tags')
    await exercise.load('media')
    await exercise.load('goal')
    let progression: Goal | undefined | null

    if (auth.isAuthenticated) {
      const user = auth.use('web').user
      await user?.load('favorites')

      progression = await user
        ?.related('progressions')
        .query()
        .where('exercise_id', exercise.id)
        .first()
    }

    return view.render('pages/exercises/show', { exercise, progression })
  }

  async create({ view, auth }: HttpContext) {
    await auth.user?.load('media')
    return view.render('pages/exercises/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const { title, content, status, media, tags } = await request.validateUsing(exerciseValidator)
    const exercise = new Exercise()
    exercise.merge({ title, content, status })
    await auth.user?.related('exercises').save(exercise)

    if (media) {
      await exercise.related('media').attach(typeof media === 'number' ? [media] : media)
    }

    if (tags) {
      const tagsEntities = await Tag.query().whereIn('label', tags)

      // Attach tags to the exercise
      const tagsToAttach = tagsEntities.map(({ id }) => [
        id,
        { taggable_type: TaggableType.EXERCISE },
      ])

      await exercise.related('tags').detach()
      await exercise.related('tags').attach(Object.fromEntries(tagsToAttach))
    }

    return response.redirect().toRoute('exercise.show', { slug: exercise.slug })
  }

  async edit({ view, params, response, bouncer, auth }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    if (await bouncer.with('ExercisePolicy').denies('edit', exercise)) {
      return response.forbidden('Cannot edit this exercise')
    }

    await auth.user?.load('media')
    await exercise.load('media')
    await exercise.load('tags')
    await exercise.load('goal')

    return view.render('pages/exercises/edit', { exercise })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    if (await bouncer.with('ExercisePolicy').denies('edit', exercise)) {
      return response.forbidden('Cannot edit this exercise')
    }

    const { title, content, status, media, tags } = await request.validateUsing(exerciseValidator)
    exercise.merge({ title, content, status })

    await exercise.related('media').detach()
    if (media) {
      await exercise.related('media').attach(typeof media === 'number' ? [media] : media)
    }

    if (tags) {
      const tagsEntities = await Tag.query().whereIn('label', tags)

      // Attach tags to the exercise
      const tagsToAttach = tagsEntities.map(({ id }) => [
        id,
        { taggable_type: TaggableType.EXERCISE },
      ])

      await exercise.related('tags').detach()
      await exercise.related('tags').attach(Object.fromEntries(tagsToAttach))
    }

    await exercise.load('tags')

    await exercise.save()
    return response.redirect().toRoute('exercises.edit', { id: exercise.id })
  }

  async destroy({ response, params, bouncer }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    if (await bouncer.with('ExercisePolicy').denies('delete', exercise)) {
      return response.forbidden('Cannot delete this exercise')
    }

    await exercise.delete()
    return response.redirect().toRoute('exercises.index')
  }
}
