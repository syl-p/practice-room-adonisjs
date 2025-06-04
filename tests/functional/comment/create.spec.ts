import { CommentFactory } from '#database/factories/comment_factory'
import { UserFactory } from '#database/factories/user_factory'
import Comment from '#models/comment'
import { test } from '@japa/runner'

test.group('Comment create', () => {
  test('comment have replies', async ({ assert }) => {
    const user = await UserFactory.create()
    const comment = await CommentFactory.create()
    const reply = new Comment()

    reply.merge({
      parentId: comment.id,
      content: 'Content of test !',
      userId: user.id,
    })
    await reply.save()

    // Loads replies
    await comment.load('replies')
    const ids = comment.replies.map((r) => r.id)

    assert.include(ids, reply.id)
  })
})
