import { makeAutoObservable } from 'mobx'

import { DownloadProgressInfo, UpdateInfo } from 'process-shared/types'

import { AppSettingsValues } from './app-settings/store'
import { SettingType } from './lib/settings'

type UpdateSettings = SettingType<Pick<AppSettingsValues, 'isGetUpdateNotifications'>>

type Config = {
  settings: UpdateSettings
}

export class UpdateStore {
  private settings: UpdateSettings

  version: string | null = null
  releaseNotes: string | null = null
  isNotificationOpened = false
  isDownloading = false
  currentPercentage = 0

  constructor(config: Config) {
    const { settings } = config

    this.settings = settings

    window.ipcRenderer.on<UpdateInfo>('updateAvailable', (_, updateInfo) => {
      this.setUpdateInfo(updateInfo)
    })
    window.ipcRenderer.on<DownloadProgressInfo>('downloadProgress', (_, downloadProgressInfo) => {
      this.setCurrentPercentage(downloadProgressInfo.percentage)
    })

    makeAutoObservable(this)
  }

  setUpdateInfo = (updateInfo: UpdateInfo): void => {
    this.version = updateInfo.version
    this.releaseNotes = updateInfo.releaseNotes
  }

  openNotification = (): void => {
    this.isNotificationOpened = true
  }
  closeNotification = (): void => {
    this.isNotificationOpened = false
  }

  setIsDownloading = (value: boolean): void => {
    this.isDownloading = value
  }

  updateGame = (): void => {
    this.setIsDownloading(true)
    window.ipcRenderer.send('updateGame')
  }

  setCurrentPercentage = (percentage: number): void => {
    this.currentPercentage = percentage
  }

  get isShowingNotificationAllowed(): boolean {
    return this.settings.values.isGetUpdateNotifications
  }
}
