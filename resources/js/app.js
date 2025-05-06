import 'htmx.org'
import Alpine from 'alpinejs'
import { Transmit } from '@adonisjs/transmit-client'
import file_uploader from './components/file_uploader'
import timer from './components/timer'
import drag_and_drop from './components/drag_and_drop'

window.Alpine = Alpine
Alpine.data('fileUpload', file_uploader)
Alpine.data('timer', timer)
Alpine.data('dragAndDrop', drag_and_drop)
Alpine.start()

const transmit = new Transmit({
  baseUrl: window.location.origin,
})

const subscription = transmit.subscription('user/' + 94 + '/notifications')
await subscription.create()

subscription.onMessage((data) => {
  const notificationsBlock = document.querySelector('#user-notifications')
  if (!notificationsBlock) return

  // List
  const list = notificationsBlock.querySelector('ul')
  if (!list) return
  const li = document.createElement('li')

  // Message format
  let message = ''
  switch (data.type) {
    case 'new_comment':
      message = 'Un nouveau commentaire à été posté votre exercice'
      break
    case 'identified':
      message = "Quelqu'un vous a identifié dans un commentaire"
      break
    default:
      message = 'New notification'
  }

  li.innerHTML = `
    <a href="${data.link || '#'}" class="block px-4 py-2 text-sm text-gray-700">
      ${message}
    </a>
  `
  list.prepend(li)

  // Indicator
  const indicator = notificationsBlock.querySelector('.indicator')
  if (!indicator) return
  indicator.classList.remove('hidden')
})
