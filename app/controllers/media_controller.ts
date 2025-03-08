import Medium from '#models/medium'
import { uploadMediumValidator } from '#validators/medium'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { dd } from '@adonisjs/core/services/dumper'

export default class mediaController {
  public async index({ view, auth }: HttpContext) {
    const user = auth.use('web')?.user
    await user?.load('media')
    return view.render('pages/media/index')
  }

  public async show({ view, params }: HttpContext) {
    return view.render('pages/media/show', {
      id: params.id,
    })
  }

  public async store({ response, request, auth }: HttpContext) {
    const { media } = await request.validateUsing(uploadMediumValidator)
    const user = auth.use('web')?.user
    const attachmentsToSave: Medium[] = []

    for (const file of media) {
      const medium = new Medium()
      await file.move(app.makePath(`storage/media/${user?.id}`))
      medium.fileUrl = `/media/${user?.id}/${file.fileName}`
      attachmentsToSave.push(medium)
    }

    await user?.related('media').saveMany(attachmentsToSave)
    return response.redirect().toRoute('media.index')
  }

  public async destroy({ params, response, session }: HttpContext) {
    const medium = await Medium.findOrFail(params.id)
    await medium.delete()

    session.flash('success', 'Your medium has been deleted')
    return response.redirect().back()
  }
}
