import React, { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';

import { Side } from 'project-utility-types/plane';

import { colors } from 'lib/theme';

type PixelsSize = 'small' | 'medium' | 'large';

type PixelatedElementProps = {
  pixelsSize: PixelsSize;
  backgroundColor: string;
};

const pixelsScales: { [_ in PixelsSize]: number } = {
  small: 0.8,
  medium: 1,
  large: 2.5,
};

const getPixelsScale = (pixelsSize: PixelsSize): number => {
  return pixelsScales[pixelsSize];
};
const getPixelsOffset = (pixelsSize: PixelsSize, pixelsCount: number): number => {
  return pixelsCount * getPixelsScale(pixelsSize);
};

type GetPixelatedPseudoElementStylesConfig = {
  pixelsSize: PixelsSize;
  offsets: Record<Side, number>;
  backgroundColor: string;
};

const getPixelatedPseudoElementStyles = ({
  pixelsSize,
  offsets,
  backgroundColor,
}: GetPixelatedPseudoElementStylesConfig): string => {
  const { bottom, right, top, left } = offsets;
  return `
  content: '';
  position: absolute;
  z-index: -1;
  bottom:  ${getPixelsOffset(pixelsSize, bottom)}px;
  right:  ${getPixelsOffset(pixelsSize, right)}px;
  top: ${getPixelsOffset(pixelsSize, top)}px;
  left:  ${getPixelsOffset(pixelsSize, left)}px;
  background-color: ${backgroundColor};
  `;
};

export const PixelatedDiv = styled.div<PixelatedElementProps>`
  position: relative;
  z-index: 3;
  background-color: ${(props) => props.backgroundColor};

  &:before {
    ${({ pixelsSize, backgroundColor }) => {
      return getPixelatedPseudoElementStyles({
        pixelsSize,
        backgroundColor,
        offsets: { bottom: 10, right: -10, top: 10, left: -10 },
      });
    }}
  }

  &:after {
    ${({ pixelsSize, backgroundColor }) => {
      return getPixelatedPseudoElementStyles({
        pixelsSize,
        backgroundColor,
        offsets: { bottom: 4, right: -6, top: 4, left: -6 },
      });
    }}
  }
`;

type PixelatedButtonProps = PixelatedElementProps & { hoverColor?: string } & {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const PixelatedButton = React.forwardRef<HTMLButtonElement, PixelatedButtonProps>(
  ({ pixelsSize, backgroundColor, className, hoverColor, children, ...buttonProps }, ref) => {
    const [isHover, setIsHover] = useState(false);

    const background = isHover ? hoverColor ?? colors.mainMediumWell : backgroundColor;

    return (
      <PixelatedDiv
        ref={ref}
        as={'button'}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        pixelsSize={pixelsSize}
        backgroundColor={background}
        className={className}
        {...buttonProps}
      >
        {children}
      </PixelatedDiv>
    );
  },
);
PixelatedButton.displayName = 'PixelatedButton';

// для инпута не работают :before и :after
export const PixelatedInput = React.forwardRef<
  HTMLInputElement,
  PixelatedElementProps & { className?: string } & {
    containerStyles?: CSSProperties;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ pixelsSize, backgroundColor, className, containerStyles, ...inputProps }, ref) => {
  return (
    <DivForPixelatedInput
      pixelsSize={pixelsSize}
      backgroundColor={backgroundColor}
      style={containerStyles}
    >
      <StyledInput ref={ref} backgroundColor={backgroundColor} className={className} {...inputProps} />
    </DivForPixelatedInput>
  );
});
PixelatedInput.displayName = 'PixelatedInput';

const DivForPixelatedInput = styled(PixelatedDiv)``;
const StyledInput = styled.input<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
`;
