import { makeAutoObservable } from 'mobx'

import { DownloadProgressInfo, UpdateInfo } from 'process-shared/types/types'

type Settings = { isGetUpdateNotifications: boolean }

type Config = {
  settings: Settings
}

export class UpdateStore {
  private settings: Settings

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

  get isShowingNotificationAllowed(): boolean {
    return this.settings.isGetUpdateNotifications
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
