import { AnyObject } from 'process-shared/types/basic-utility-types'

import { AnyEditableSetting, EditableSettingVariant } from 'stores/entities/editable-settings/types'

import { objectMap } from 'lib/objects'

export type SettingType<T> = { values: T }

export type EditableSettings<T extends AnyObject> = { [K in keyof T]: AnyEditableSetting }

export const getConvertedEditableSettings = <
  K extends keyof T,
  T extends Record<K, EditableSettingVariant<any>>,
>(
  editableSettings: T,
): { [K in keyof T]: T[K]['value'] } => {
  return objectMap(editableSettings, ({ value }) => value)
}
