import { makeAutoObservable } from 'mobx'

import isElectron from 'is-electron'
import { Entries } from 'process-shared/types/basic-utility-types'

import { CheckboxSetting } from 'stores/entities/editable-settings/checkbox-setting'
import { RadioSetting } from 'stores/entities/editable-settings/radio-setting'
import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'
import { getConvertedEditableSettings } from 'stores/lib/settings'

import { areEquivalent } from 'lib/are-equivalent'

import { EditableAppSettings } from './editable'
import initialSettingsJSON from './initial-settings.json'

export type AppSettingsValues = {
  isGetUpdateNotifications: boolean
}

export class AppSettingsStore {
  constructor() {
    this.initialize()
    makeAutoObservable(this)
  }

  editable = new EditableAppSettings()

  private initialize = (): void => {
    var settingsFromFile = initialSettingsJSON
    if (isElectron()) {
      const isSettingsFileExists = window.ipcRenderer.sendSync<undefined, boolean>(
        'checkIfAppSettingsFileExists',
      )
      if (!isSettingsFileExists) {
        this.createSettingsFile()
      }
      settingsFromFile = this.getSettingsFromFile()
    }
    this.syncEditableWithFile(settingsFromFile)
  }

  setSettingsToFileSync = (settings: AppSettingsValues): void => {
    window.ipcRenderer.sendSync('setAppSettingsToFileSync', settings)
  }
  setSettingsToFileAsync = (settings: AppSettingsValues): Promise<void> => {
    return window.ipcRenderer.invoke<AppSettingsValues, void>('setAppSettingsToFileAsync', settings)
  }

  private createSettingsFile = (): void => {
    return this.setSettingsToFileSync(initialSettingsJSON)
  }

  private getSettingsFromFile = (): AppSettingsValues => {
    return window.ipcRenderer.sendSync<undefined, AppSettingsValues>('getAppSettings')
  }

  saveSettingsToFile = (): Promise<void> => {
    return this.setSettingsToFileAsync(this.values)
  }

  private syncEditableWithFile = (values: AppSettingsValues): void => {
    return (Object.entries(values) as Entries<AppSettingsValues>).forEach(([name, value]) => {
      const thisEditableSetting = this.editable[name]

      if (thisEditableSetting instanceof SingleValueSetting) {
        thisEditableSetting.set(value)
      }

      if (thisEditableSetting instanceof CheckboxSetting) {
        thisEditableSetting.variants.forEach((v) => {
          if (areEquivalent(v, value)) {
            thisEditableSetting.selectVariant(v.id)
          } else {
            thisEditableSetting.unselectVariant(v.id)
          }
        })
      }

      if (thisEditableSetting instanceof RadioSetting) {
        thisEditableSetting.variants.forEach((v) => {
          if (areEquivalent(v, value)) {
            thisEditableSetting.selectVariant(v.id)
          }
        })
      }
    })
  }

  get values(): AppSettingsValues {
    return getConvertedEditableSettings(this.editable)
  }
}
