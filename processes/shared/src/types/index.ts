export type IpcEventName =
  | 'updateAvailable'
  | 'updateGame'
  | 'downloadProgress'
  | 'checkIfAppSettingsFileExists'
  | 'setAppSettingsToFileAsync'
  | 'setAppSettingsToFileSync'
  | 'getAppSettings'

export type UpdateInfo = {
  version: string
  releaseNotes: string
}

export type DownloadProgressInfo = {
  percentage: number
}
