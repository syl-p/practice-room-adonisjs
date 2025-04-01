import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'

export default class TagsController {
  public async index({ request, view }: HttpContext) {
    const { tag } = request.qs()
    let tags: Tag[] = []

    if (tag !== '') {
      tags = await Tag.query().where('label', 'like', `%${tag}%`).limit(10)
    }

    return view.render('fragments/tags', { tags })
  }
}
