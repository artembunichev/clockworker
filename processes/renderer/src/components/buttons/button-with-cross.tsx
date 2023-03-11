import { observer } from 'mobx-react-lite';
import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import { FC } from 'basic-utility-types';

import { colors } from 'lib/theme';

import { PixelatedButton } from 'components/pixelated/pixelated-components';

import { CrossIcon } from 'assets/icons/cross';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

export const ButtonWithCross: FC<Props> = observer( ( { className, ...buttonProps } ) => {
  return (
    <Button className={className} {...buttonProps}>
      <CrossIcon size={17.5} />
    </Button>
  );
} );

const Button = styled( PixelatedButton ).attrs( {
  pixelsSize: 'small',
  backgroundColor: colors.mainMedium,
} )`
  width: 21px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
