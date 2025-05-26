import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('User create', () => {
  test('password is hashed', async ({ assert }) => {
    const user = await new User()
    await user.merge({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password',
    })
    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'password'))
  })
})
