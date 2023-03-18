import { FC } from 'basic-utility-types';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const PortalToBody: FC = observer( ( { children } ) => {
  const [ container ] = useState( () => document.createElement( 'div' ) );

  useEffect( () => {
    document.body.appendChild( container );

    return () => {
      document.body.removeChild( container );
    };
  } );

  return createPortal( children, container );
} );
