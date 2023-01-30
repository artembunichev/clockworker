import { makeAutoObservable } from 'mobx'

import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'
import { EditableSettings } from 'stores/lib/settings'

import { AppSettingsValues } from './app-settings.store'

export type EditableAppSettingsType = EditableSettings<AppSettingsValues>

export class EditableAppSettings implements EditableAppSettingsType {
  isGetUpdateNotifications = new SingleValueSetting('isGetUpdateNotifications', true)

  constructor() {
    makeAutoObservable(this)
  }
}
