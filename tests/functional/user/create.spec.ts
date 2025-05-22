import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('User create', () => {
  test('password is hashed', async ({ assert }) => {
    const user = await User.create({
      username: 'functional_test',
      email: 'test@functional.test',
      password: 'password',
    })

    assert.notEqual(user.password, 'password')
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'password'))
  })
})
