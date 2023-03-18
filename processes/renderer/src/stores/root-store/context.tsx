import { FC } from 'basic-utility-types';
import { createContext, useContext } from 'react';
import { RootStore } from './store';

const RootStoreContext = createContext<RootStore | null>( null );

export const RootStoreProvider: FC = ( { children } ) => {
  const rootStore = new RootStore();
  return <RootStoreContext.Provider value={ rootStore }>{ children }</RootStoreContext.Provider>;
};

export const useStore = (): RootStore => {
  const rootStore = useContext( RootStoreContext );
  if ( !rootStore ) {
    throw new Error( 'You have forgotten to wrap root component with RootStoreProvider' );
  }
  return rootStore;
};
