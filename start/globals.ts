import UtilityService from '#services/utility_service'
import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import CommentableType from '#enums/commentable_types'
import TaggableType from '#enums/taggable_type'
import ActivityStatuses from '#enums/activity_statuses'
import GoalLabels from '#enums/goal_labels'

edge.use(edgeIconify)
addCollection(heroIcons)

edge.global('utils', UtilityService)
edge.global('ActivityStatuses', ActivityStatuses)
edge.global('GoalLabels', GoalLabels)
edge.global('CommentableType', CommentableType)
edge.global('TaggableType', TaggableType)
