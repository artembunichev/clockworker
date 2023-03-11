import { RadioSetting } from 'stores/entities/editable-settings/radio-setting';
import { EditableSettings } from 'stores/lib/settings';

import { GameSettingsValues, MovementControllersKeys } from '.';

export type EditableGameSettingsType = Partial<EditableSettings<GameSettingsValues>>;

// настройки, которые могут изменяться пользователем
export class EditableGameSettings implements EditableGameSettingsType {
  movementControllers = new RadioSetting<MovementControllersKeys>( {
    id: 'movementControllers',
    variants: [
      {
        id: 'wasd',
        label: 'WASD',
        value: {
          down: 'KeyS',
          right: 'KeyD',
          up: 'KeyW',
          left: 'KeyA',
        },
        isSelected: true,
      },
      {
        id: 'arrows',
        label: 'Стрелочки',
        value: {
          down: 'ArrowDown',
          right: 'ArrowRight',
          up: 'ArrowUp',
          left: 'ArrowLeft',
        },
        isSelected: false,
      },
    ],
  } );
}
