import { GameSettingsValues } from './settings'

type InternalGameSettingsType = Partial<GameSettingsValues>

export class InternalGameSettings implements InternalGameSettingsType {
  movementRegulators = { sprint: 'ShiftLeft' }
}
