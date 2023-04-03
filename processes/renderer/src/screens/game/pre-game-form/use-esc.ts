import { useEsc } from 'hooks/use-esc'
import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

type Config = { gamePlayStore: GamePlayStore | null }

export const usePreGameFormScreenEsc = ( config: Config ): void => {
  const { quitInMainMenuConfirm } = useStore().appStore.popups
  const { gamePlayStore } = config

  useEsc(
    {
      fn: quitInMainMenuConfirm.toggle,
      ignoreWhen: gamePlayStore?.opening.isOpened,
    },
    [ gamePlayStore ],
  )
}
