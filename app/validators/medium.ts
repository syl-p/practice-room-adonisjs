import vine from '@vinejs/vine'

export const uploadMediumValidator = vine.compile(
  vine.object({
    media: vine.array(
      vine.file({
        size: '3mb',
        extnames: ['jpg', 'png', 'pdf'],
      })
    ),
  })
)
