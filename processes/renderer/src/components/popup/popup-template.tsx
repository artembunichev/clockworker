import { FC } from 'basic-utility-types';
import { ButtonWithCross } from 'components/buttons/button-with-cross';
import { PortalToBody } from 'components/utility/portal-to-body';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import { CSSProperties, useEffect } from 'react';
import { doubleBorderStyle } from 'shared-styles';
import { Callback, RequiredBy } from 'shared/types/basic-utility-types';
import styled from 'styled-components';

export type PopupProps = {
  width: string;
  height: string;
  styles: RequiredBy<CSSProperties, 'backgroundColor'>;
  title?: string;
  titleStyles?: CSSProperties;
  isOpened: boolean;
  withCloseButton?: boolean;
  fnForClosing?: Callback;
  onClose?: Callback;
};

export const Popup: FC<PopupProps> = observer(
  ( {
    width,
    height,
    styles,
    title,
    titleStyles,
    withCloseButton,
    isOpened,
    fnForClosing,
    onClose,
    children,
  } ) => {
    useEffect( () => {
      return () => {
        // закрытие попапа
        if ( isOpened === true ) {
          onClose?.();
        }
      };
    }, [ isOpened ] );

    if ( !isOpened ) {
      return null;
    }

    return (
      <PortalToBody>
        <Container>
          <Block width={ width } height={ height } style={ styles }>
            { ( withCloseButton || title ) && (
              <Heading>
                { title && <Title style={ titleStyles }>{ title }</Title> }
                { withCloseButton && <CloseButton onClick={ fnForClosing } /> }
              </Heading>
            ) }
            <Body>{ children }</Body>
          </Block>
        </Container>
      </PortalToBody>
    );
  },
);

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000083;
`;
const Block = styled.div<{ width: string; height: string; color?: string; }>`
  display: flex;
  flex-direction: column;
  width: ${ ( props ) => props.width };
  height: ${ ( props ) => props.height };
  position: relative;
  padding: 20px;
  margin: 30px;
  box-shadow: 0px 0px 25px 8px ${ colors.shadow };
  ${ doubleBorderStyle }
`;
const Heading = styled.div`
  min-height: 32px;
  position: relative;
  margin-bottom: 15px;
`;
const Title = styled.h2`
  font-size: 36px;
  text-align: center;
`;
const CloseButton = styled( ButtonWithCross )`
  position: absolute;
  right: 0;
  top: 0;
`;
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`;
