import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { useGamePlayStore } from '../screen'

export const handleGamePlayScreenEsc = (): void => {
  const { appStore } = useStore()
  const gamePlayStore = useGamePlayStore()

  useKey({
    key: 'Escape',
    defaultFn: () => {
      gamePlayStore.pauseController.toggleGamePause()
      gamePlayStore.menusController.toggle('pause')
    },
    variants: [
      {
        when: appStore.quitGameConfirm.isOpened,
        fn: appStore.quitGameConfirm.close,
      },
      {
        when: appStore.quitInMainMenuConfirm.isOpened,
        fn: appStore.quitInMainMenuConfirm.close,
      },
      {
        when: gamePlayStore.menusController.isSettingsMenuOpened,
        fn: () => {
          gamePlayStore.menusController.closeCurrentMenu()
          gamePlayStore.menusController.openMenu('pause')
        },
      },
    ],
    ignoreWhen: [gamePlayStore.opening.isOpened, gamePlayStore.textboxesController.isTextboxOpened],
  })
}
