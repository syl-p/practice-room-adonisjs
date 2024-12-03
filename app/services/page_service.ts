import app from '@adonisjs/core/services/app'
import { readdir, readFile } from 'node:fs/promises'
import { MarkdownFile } from '@dimerapp/markdown'
import { Exception } from '@adonisjs/core/exceptions'

export default class PageService {
  static getSlugUrl(slug: string) {
    if (!slug.endsWith('.md')) {
      slug += '.md'
    }

    return app.makeURL(`resources/content/${slug}`)
  }

  static async getSlugs(dir: string) {
    const files = await readdir(app.makeURL(`resources/content/${dir}`))
    return files.map(async (file) => file.replace('.md', ''))
  }

  static async read(slug: string) {
    const url = this.getSlugUrl(slug)

    try {
      const file = await readFile(url, 'utf8')

      const md = new MarkdownFile(file)
      await md.process()

      return md
    } catch (error) {
      throw new Exception(`No found page for ${slug}`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
  }
}
