import { useEsc } from 'hooks/use-esc'
import { useStore } from 'stores/root-store/context'

export const useMainScreenEsc = (): void => {
	const { quitGameConfirm } = useStore().appStore.popups

	useEsc( { fn: quitGameConfirm.toggle } )
}
