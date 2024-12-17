/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
const RegistersController = () => import('#controllers/auth/registers_controller')
const LoginController = () => import('#controllers/auth/login_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const LogoutsController = () => import('#controllers/auth/logouts_controller')
const ExercisesController = () => import('#controllers/exercises_controller')
const PagesController = () => import('#controllers/pages_controller')

router.get('/', [PagesController, 'index']).as('home')
router
  .get('/pages/:slug', [PagesController, 'show'])
  .as('page.show')
  .where('slug', router.matchers.slug())

router.resource('exercises', ExercisesController).only(['index', 'store'])
router
  .get('/exercise/:slug', [ExercisesController, 'show'])
  .as('exercise.show')
  .where('slug', router.matchers.slug())

router
  .post('/exercise/practice/:id', [ExercisesController, 'addToPractice'])
  .as('exercise.addToPractice')

router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())
    router
      .get('/register', [RegistersController, 'show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [RegistersController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    router.post('/logout', [LogoutsController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('auth')
  .as('auth')

router.resource('users', UsersController).only(['index', 'show'])
