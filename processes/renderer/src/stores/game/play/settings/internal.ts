import { GameSettingsValues } from '.'

type InternalGameSettingsType = Partial<GameSettingsValues>

export class InternalGameSettings implements InternalGameSettingsType {
	movementRegulators = { sprint: 'ShiftLeft' };
}
