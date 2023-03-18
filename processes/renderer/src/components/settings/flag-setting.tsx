import { FC } from 'basic-utility-types';
import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting';

type Props = {
  setting: SingleValueSetting<boolean>;
  checkboxSize: number;
};

export const FlagSetting: FC<Props> = observer( ( { setting, checkboxSize } ) => {
  const onSelect = (): void => {
    setting.setValue( true );
  };

  const onUnselect = (): void => {
    setting.setValue( false );
  };

  return (
    <PixelatedCheckbox
      size={ checkboxSize }
      checked={ setting.value }
      onSelect={ onSelect }
      onUnselect={ onUnselect }
      backgroundColor={ colors.mainMedium }
      checkedBackgroundColor={ colors.mainMediumWell }
    />
  );
} );
