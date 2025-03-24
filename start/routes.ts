/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const SearchController = () => import('#controllers/search_controller')

const PracticedExercisesController = () => import('#controllers/practiced_exercises_controller')

const UsersController = () => import('#controllers/users_controller')
const RegistersController = () => import('#controllers/auth/registers_controller')
const LoginController = () => import('#controllers/auth/login_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ProgressionsController = () => import('#controllers/progressions_controller')
const HomeController = () => import('#controllers/home_controller')
const FavoritesController = () => import('#controllers/favorites_controller')
const MediaController = () => import('#controllers/media_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const CommentsController = () => import('#controllers/comments_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const ExercisesController = () => import('#controllers/exercises_controller')
const PagesController = () => import('#controllers/pages_controller')

router.get('/', [HomeController, 'index']).as('home')
router.get('/avatars/:filename', [UsersController, 'avatar'])

router
  .get('/pages/:slug', [PagesController, 'show'])
  .as('page.show')
  .where('slug', router.matchers.slug())

// EXERCISES
router
  .resource('exercises', ExercisesController)
  .except(['show', 'index'])
  .use(['edit', 'store', 'destroy', 'create'], middleware.auth())

router
  .get('/exercises/:slug', [ExercisesController, 'show'])
  .as('exercise.show')
  .where('slug', router.matchers.slug())

// PROGRESSIONS
router
  .post('progression/:id', [ProgressionsController, 'save'])
  .as('progression.save')
  .use(middleware.auth())

// FAVORITES
router.get('/favorites', [FavoritesController, 'index']).as('favorites').use(middleware.auth())
router
  .post('/favorites/:id', [FavoritesController, 'store'])
  .as('favorites.add')
  .use(middleware.auth())
router
  .delete('/favorites/:id', [FavoritesController, 'destroy'])
  .as('favorites.remove')
  .use(middleware.auth())

// COMMENTS
router.resource('comments', CommentsController).only(['edit', 'update', 'destroy'])
router.resource('exercises.comments', CommentsController).only(['index', 'store'])
router.resource('comments.comments', CommentsController).only(['store'])

// PRACTICES
router
  .post('/exercises/practice/:id', [PracticedExercisesController, 'store'])
  .as('exercise.addToPractice')
  .use(middleware.auth())

router
  .resource('practices', PracticedExercisesController)
  .only(['index', 'store', 'destroy'])
  .use(['index', 'store', 'destroy'], middleware.auth())

router
  .get('/practices/previous-week', [PracticedExercisesController, 'previousWeek'])
  .use(middleware.auth())
  .as('practices.previousWeek')
router
  .get('/practices/next-week', [PracticedExercisesController, 'nextWeek'])
  .use(middleware.auth())
  .as('practices.nextWeek')

// MEDIA
router
  .resource('media', MediaController)
  .only(['index', 'show', 'store', 'destroy'])
  .use(['index', 'store', 'destroy'], middleware.auth())

// AUTH
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

    router
      .get('/register/edit/', [RegistersController, 'edit'])
      .as('register.edit')
      .use(middleware.auth())

    router
      .patch('/register/edit/', [RegistersController, 'update'])
      .as('register.update')
      .use(middleware.auth())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('auth')
  .as('auth')

// USERS
router.resource('users', UsersController).only(['index', 'show', 'edit'])
router
  .post('user/:id/follow', [UsersController, 'follow'])
  .use(middleware.auth())
  .as('users.follow')
router
  .delete('user/:id/unfollow', [UsersController, 'unfollow'])
  .use(middleware.auth())
  .as('users.unfollow')

// OTHER
router.get('search', [SearchController, 'index']).as('search')
router.get('dashboard', [DashboardController, 'index']).use(middleware.auth()).as('dashboard')
