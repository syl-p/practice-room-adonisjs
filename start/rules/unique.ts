import db from '@adonisjs/lucid/services/db'
import type { FieldContext } from '@vinejs/vine/types'
import vine from '@vinejs/vine'

type Options = {
  table: string
  column: string
}

async function isUnique(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const result = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (result) {
    field.report('this {{field}} is already taken', 'isUnique', field)
  }
}

export const uniqueRule = vine.createRule(isUnique)
