import { FC } from 'basic-utility-types';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useGamePlayStore } from 'screens/game/screen';
import styled from 'styled-components';
import { PlayCanvasOverlay } from './overlay';

export const PlayCanvas: FC = observer( () => {
  const gamePlayStore = useGamePlayStore();

  const containerRef = useRef<HTMLDivElement | null>( null );
  useEffect( () => {
    if ( gamePlayStore.isGameInitialized && gamePlayStore.screen.canvas && containerRef.current ) {
      // "рендер" канваса, созданного в сторе
      containerRef.current.appendChild( gamePlayStore.screen.canvas );
    }
  }, [ gamePlayStore.isGameInitialized ] );

  return (
    <>
      <Container ref={ containerRef }>
        <PlayCanvasOverlay />
      </Container>
    </>
  );
} );

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
`;
