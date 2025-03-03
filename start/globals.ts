import UtilityService from '#services/utility_service'
import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import CommentableType from '#enums/commentable_types'
import TaggableType from '#enums/taggable_type'
import ExerciseStatuses from '#enums/exercise_statuses'

edge.use(edgeIconify)
addCollection(heroIcons)

edge.global('utils', UtilityService)
edge.global('ExerciseStatuses', ExerciseStatuses)
edge.global('CommentableType', CommentableType)
edge.global('TaggableType', TaggableType)
