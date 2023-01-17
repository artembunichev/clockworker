import { useEsc } from 'hooks/use-esc'

import { useGamePlayStore } from '../screen'

export const useGamePlayScreenEsc = (): void => {
  const gamePlayStore = useGamePlayStore()

  useEsc({
    fn: gamePlayStore.popups.pauseMenu.toggle,
    ignoreWhen: [gamePlayStore.opening.isOpened, gamePlayStore.textboxController.isTextboxOpened],
  })
}
