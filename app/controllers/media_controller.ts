import type { HttpContext } from '@adonisjs/core/http'

export default class MediaController {
  public async index({ view }: HttpContext) {
    return view.render('media/index')
  }

  public async show({ view, params }: HttpContext) {
    return view.render('media/show', {
      id: params.id,
    })
  }
}
