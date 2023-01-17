import { makeAutoObservable } from 'mobx'

import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'
import { EditableSettings } from 'stores/lib/settings'

import { AppSettingsValues } from './settings.store'

export type EditableAppSettingsType = EditableSettings<AppSettingsValues>

export class EditableAppSettings implements EditableAppSettingsType {
  constructor() {
    makeAutoObservable(this)
  }

  isGetUpdateNotifications = new SingleValueSetting('isGetUpdateNotifications', true)
}
