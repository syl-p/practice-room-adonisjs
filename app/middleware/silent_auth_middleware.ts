import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import CacheService from '#services/cache_service'
import { DateTime } from 'luxon'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.check()

    // Load PracticeTime info
    if (ctx.auth.isAuthenticated && ctx.auth.user) {
      const cacheKey = `practice_time:${ctx.auth.user.id}:${DateTime.now().toFormat('yyyy-LL-dd')}`
      const practiceTime = await CacheService.fetch(cacheKey, async () => {
        const practices = await ctx.auth.user
          ?.related('practicedActivities')
          .query()
          .apply((scope) => scope.today())

        return practices?.reduce((accumulator, practice) => accumulator + practice.duration, 0)
      })
      ctx.view.share({ practiceTime })
    }
    return next()
  }
}
