import { configureMobx } from 'configure-mobx';
import React from 'react';

import { addIconsToDist } from 'add-icons-to-dist';
import { App } from 'app';
import ReactDOM from 'react-dom/client';

import { RootStoreProvider } from 'stores/root-store/context';

configureMobx();

addIconsToDist();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>,
);
