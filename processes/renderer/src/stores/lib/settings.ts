import { objectMapAll } from 'process-shared/lib/objects'

import { AnyEditableSetting, EditableSettingVariant } from 'stores/entities/editable-settings/types'

export type SettingType<T> = { values: T }

export type EditableSettings<T extends object> = { [K in keyof T]: AnyEditableSetting }

export const getConvertedEditableSettings = <
  K extends keyof T,
  T extends Record<K, EditableSettingVariant<any>>,
>(
  editableSettings: T,
): { [K in keyof T]: T[K]['value'] } => {
  return objectMapAll(editableSettings, ({ value }) => value)
}
