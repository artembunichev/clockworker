import { makeAutoObservable } from 'mobx'

import { getConvertedEditableSettings } from 'stores/lib/settings'

import { merge } from 'lib/objects'

import { EditableGameSettings } from './editable'
import { InternalGameSettings } from './internal'

export type MovementControllersKeys = {
  down: string
  right: string
  up: string
  left: string
}
export type MovementRegulatorsKeys = {
  sprint: string
}

export type GameSettingsValues = {
  movementControllers: MovementControllersKeys
  movementRegulators: MovementRegulatorsKeys
}

export class GameSettings {
  internal = new InternalGameSettings()
  editable = new EditableGameSettings()

  constructor() {
    makeAutoObservable(this)
  }

  private get convertedEditableSettings(): Partial<GameSettingsValues> {
    return getConvertedEditableSettings(this.editable)
  }

  get values(): GameSettingsValues {
    return merge(this.internal, this.convertedEditableSettings) as GameSettingsValues
  }
}
