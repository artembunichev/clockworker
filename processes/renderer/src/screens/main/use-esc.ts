import { useStore } from 'stores/root-store/context';

import { useEsc } from 'hooks/use-esc';

export const useMainScreenEsc = (): void => {
  const { quitGameConfirm } = useStore().appStore.popups;

  useEsc( { fn: quitGameConfirm.toggle } );
};
