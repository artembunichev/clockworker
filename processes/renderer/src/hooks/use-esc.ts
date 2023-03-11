import { Rename } from 'shared/types/basic-utility-types';

import { closeLastUnclosedPopup } from 'stores/lib/popups';
import { useStore } from 'stores/root-store/context';

import { UseKeyConfig, UseKeyVariant, useKey } from './use-key';

export type UseEscConfig = Rename<Omit<UseKeyConfig, 'key'>, 'defaultFn', 'fn'>;

export const useEsc = (
  { fn, variants, ignoreWhen, element }: UseEscConfig,
  deps?: Array<any>,
): void => {
  const { popupHistory } = useStore();

  const appPopupOpenedVariant: UseKeyVariant = {
    when: popupHistory.isOpenedPopups,
    fn: () => closeLastUnclosedPopup( popupHistory ),
  };

  useKey(
    {
      element,
      key: 'Escape',
      defaultFn: fn,
      variants: [ appPopupOpenedVariant, ...( variants ?? [] ) ],
      ignoreWhen,
    },
    deps,
  );
};
