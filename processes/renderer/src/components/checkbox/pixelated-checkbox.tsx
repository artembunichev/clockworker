import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components';

import { FC } from 'basic-utility-types';
import { Callback } from 'shared/types/basic-utility-types';

import { PixelatedDiv } from 'components/pixelated/pixelated-components';

import { CheckMarkIcon } from 'assets/icons/check-mark';

export type PixelatedCheckboxProps = {
  size: number;
  checked?: boolean;
  onSelect?: Callback;
  onUnselect?: Callback;
  backgroundColor: string;
  checkedBackgroundColor: string;
};

export const PixelatedCheckbox: FC<PixelatedCheckboxProps> = observer(
  ( { size, checked, onSelect, onUnselect, backgroundColor, checkedBackgroundColor } ) => {
    const onClick = (): void => {
      if ( !checked ) {
        onSelect?.();
      } else {
        onUnselect?.();
      }
    };

    const background = checked ? checkedBackgroundColor : backgroundColor;

    const checkMarkSize = size + 4;

    return (
      <StyledPixelatedCheckbox size={size} onClick={onClick} backgroundColor={background}>
        {checked && (
          <CheckMarkContainer>
            <CheckMarkIcon size={checkMarkSize} />
          </CheckMarkContainer>
        )}
      </StyledPixelatedCheckbox>
    );
  },
);

export const StyledPixelatedCheckbox = styled( PixelatedDiv ).attrs( {
  pixelsSize: 'small',
} )<{ size: number }>`
  width: ${( props ) => props.size}px;
  height: ${( props ) => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CheckMarkContainer = styled.div`
  position: absolute;
  top: -5px;
`;
