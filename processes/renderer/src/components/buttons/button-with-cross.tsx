import { CrossIcon } from 'assets/icons/cross';
import { FC } from 'basic-utility-types';
import { PixelatedButton } from 'components/pixelated/pixelated-components';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; };

export const ButtonWithCross: FC<Props> = observer( ( { className, ...buttonProps } ) => {
  return (
    <Button className={ className } { ...buttonProps }>
      <CrossIcon size={ 17.5 } />
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
