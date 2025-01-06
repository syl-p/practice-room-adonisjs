import redis from '@adonisjs/redis/services/main'

class CacheService {
  async has(...keys: string[]) {
    return await redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value && JSON.parse(value)
  }

  async fetch(key: string, callback: () => any) {
    if (await this.has(key)) {
      console.log('use cache')
      return await this.get(key)
    } else {
      console.log('construct cache')
      const value: any = await callback()
      await this.set(key, value)
      return value && JSON.parse(value)
    }
  }

  async set(key: string, value: any) {
    return redis.set(key, value)
  }

  async delete(key: string) {
    return redis.del(key)
  }
}

export default new CacheService()
