import { makeAutoObservable } from 'mobx'

import isElectron from 'is-electron'
import { isEqual } from 'process-shared/lib/is-equal'
import { objectEntries } from 'process-shared/lib/objects'

import { CheckboxSetting } from 'stores/entities/editable-settings/checkbox-setting'
import { RadioSetting } from 'stores/entities/editable-settings/radio-setting'
import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'
import { getConvertedEditableSettings } from 'stores/lib/settings'

import { EditableAppSettings } from './editable-settings'

export type AppSettingsValues = {
  isGetUpdateNotifications: boolean
}

export class AppSettingsStore {
  editable = new EditableAppSettings()

  constructor() {
    this.initialize()
    makeAutoObservable(this)
  }

  private initialize = (): void => {
    if (isElectron()) {
      const isSettingsFileExists = window.ipcRenderer.sendSync<undefined, boolean>(
        'checkIfAppSettingsFileExists',
      )
      if (!isSettingsFileExists) {
        this.createSettingsFile(this.values)
      } else {
        this.syncSettingsWithFile()
      }
    }
  }

  setSettingsToFileSync = (settings: AppSettingsValues): void => {
    window.ipcRenderer.sendSync('setAppSettingsToFileSync', settings)
  }
  setSettingsToFileAsync = (settings: AppSettingsValues): Promise<void> => {
    return window.ipcRenderer.invoke<AppSettingsValues, void>('setAppSettingsToFileAsync', settings)
  }

  private createSettingsFile = (settings: AppSettingsValues): void => {
    return this.setSettingsToFileSync(settings)
  }

  private getSettingsFromFile = (): AppSettingsValues => {
    return window.ipcRenderer.sendSync<undefined, AppSettingsValues>('getAppSettings')
  }

  saveSettingsToFile = (): Promise<void> => {
    return this.setSettingsToFileAsync(this.values)
  }

  // читаем значения из файла и устанавливаем их в editable
  private syncSettingsWithFile = (): void => {
    const values = this.getSettingsFromFile()

    objectEntries(values).forEach(([name, value]) => {
      const thisEditableSetting = this.editable[name]

      if (thisEditableSetting instanceof SingleValueSetting) {
        thisEditableSetting.setValue(value)
      }

      if (thisEditableSetting instanceof CheckboxSetting) {
        thisEditableSetting.variants.forEach((v) => {
          if (isEqual(v, value)) {
            thisEditableSetting.selectVariant(v.id)
          } else {
            thisEditableSetting.unselectVariant(v.id)
          }
        })
      }

      if (thisEditableSetting instanceof RadioSetting) {
        thisEditableSetting.variants.forEach((v) => {
          if (isEqual(v, value)) {
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
