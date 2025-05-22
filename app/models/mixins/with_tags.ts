import { computed, manyToMany, type BaseModel } from '@adonisjs/lucid/orm'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import Tag from '#models/tag'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'

export default <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
  class ParentClass extends superclass {
    @manyToMany(() => Tag, {
      pivotTable: 'tag_taggable',
      pivotForeignKey: 'taggable_id',
      pivotRelatedForeignKey: 'tag_id',
      // pivotTimestamps: true,
      onQuery: (query) => query.where('taggable_type', superclass.name),
    })
    declare tags: ManyToMany<typeof Tag>

    @computed()
    get superclassName() {
      return stringHelpers.snakeCase(superclass.name)
    }
  }

  return ParentClass
}
