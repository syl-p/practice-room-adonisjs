import type { HttpContext } from '@adonisjs/core/http'
import { toHtml } from '@dimerapp/markdown/utils'
import PageService from '#services/page_service'

export default class PagesController {
  async index({ view }: HttpContext) {
    return view.render('pages/home')
  }

  async show({ params, view }: HttpContext) {
    const md = await PageService.read(params.slug)
    const page = toHtml(md).contents
    view.share({ page })
    return view.render('pages/show')
  }
}
