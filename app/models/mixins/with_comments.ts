import { hasMany, type BaseModel } from '@adonisjs/lucid/orm'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Comment from '#models/comment'

export function withComments(modelName: string) {
  return <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
    class ParentClass extends superclass {
      @hasMany(() => Comment, {
        foreignKey: 'commentableId',
        onQuery: (query) => query.where('commentable_type', modelName),
      })
      declare comments: HasMany<typeof Comment>
    }

    return ParentClass
  }
}
