import { addIconsToDist } from 'add-icons-to-dist';
import { App } from 'app';
import { configureMobx } from 'configure-mobx';
import ReactDOM from 'react-dom/client';
import { RootStoreProvider } from 'stores/root-store/context';

configureMobx();

addIconsToDist();

ReactDOM.createRoot( document.getElementById( 'root' ) as HTMLElement ).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>,
);
