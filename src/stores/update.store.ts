import { makeAutoObservable } from 'mobx'

import { DownloadProgressInfo, UpdateInfo } from 'main-renderer-shared/types'

import { AppSettingsStore } from './settings/settings.store'

type Config = {
  appSettings: AppSettingsStore
}

export class UpdateStore {
  private appSettings: AppSettingsStore

  constructor(config: Config) {
    const { appSettings } = config

    this.appSettings = appSettings

    window.ipcRenderer.on<UpdateInfo>('updateAvailable', (_, updateInfo) => {
      this.setUpdateInfo(updateInfo)
    })
    window.ipcRenderer.on<DownloadProgressInfo>('downloadProgress', (_, downloadProgressInfo) => {
      this.setCurrentPercentage(downloadProgressInfo.percentage)
    })

    makeAutoObservable(this)
  }

  get isShowingNotificationAllowed(): boolean {
    return this.appSettings.values.isGetUpdateNotifications
  }

  version: string | null = null
  releaseNotes: string | null = null

  setUpdateInfo = (updateInfo: UpdateInfo): void => {
    this.version = updateInfo.version
    this.releaseNotes = updateInfo.releaseNotes
  }

  isNotificationOpened = false
  openNotification = (): void => {
    this.isNotificationOpened = true
  }
  closeNotification = (): void => {
    this.isNotificationOpened = false
  }

  updateGame = (): void => {
    window.ipcRenderer.send('updateGame')
  }

  currentPercentage: number | null = null
  setCurrentPercentage = (percentage: number): void => {
    this.currentPercentage = percentage
  }
}
