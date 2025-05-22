import { manyToMany, type BaseModel } from '@adonisjs/lucid/orm'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import Tag from '#models/tag'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export function withTags(modelName: string) {
  return <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
    class ParentClass extends superclass {
      @manyToMany(() => Tag, {
        pivotTable: 'tag_taggable',
        pivotForeignKey: 'taggable_id',
        pivotRelatedForeignKey: 'tag_id',
        // pivotTimestamps: true,
        onQuery: (query) => query.where('taggable_type', modelName),
      })
      declare tags: ManyToMany<typeof Tag>
    }

    return ParentClass
  }
}
