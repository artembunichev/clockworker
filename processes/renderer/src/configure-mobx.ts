import { configure } from 'mobx'

export const configureMobx = (): void => {
  configure( { enforceActions: 'never' } )
}
