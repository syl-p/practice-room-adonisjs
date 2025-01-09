import redis from '@adonisjs/redis/services/main'

class CacheService {
  async has(...keys: string[]) {
    return redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value && JSON.parse(value)
  }

  async fetch(key: string, callback: () => any) {
    let value = await this.get(key)
    if (value) {
      return value
    } else {
      value = await callback()
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
