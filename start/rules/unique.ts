import type { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}

async function isUnique(value: unknown, options: Options, field: FieldContext) {}
