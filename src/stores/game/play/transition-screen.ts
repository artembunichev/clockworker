import { makeAutoObservable } from 'mobx'

import { delay } from 'lib/async'

import { SharedPlayMethods } from './shared-methods/shared-methods'

export type TransitionScreenConfig = {
  appearanceMs: number
  disappearanceMs: number
  durationMs?: number
  background: string
  sharedPlayMethods: SharedPlayMethods
}
export class TransitionScreen {
  appearanceMs: number
  disappearanceMs: number
  durationMs: number
  background: string

  private sharedPlayMethods: SharedPlayMethods

  constructor(config: TransitionScreenConfig) {
    this.appearanceMs = config.appearanceMs
    this.disappearanceMs = config.disappearanceMs
    this.durationMs = config.durationMs ?? 0
    this.background = config.background
    this.sharedPlayMethods = config.sharedPlayMethods

    makeAutoObservable(this)
  }

  isOpened = false
  open = async (): Promise<void> => {
    this.sharedPlayMethods.playerCharacter.addMovementKeysProhibitor('transitionScreen')
    this.isOpened = true
    await delay(this.appearanceMs)
  }
  close = async (): Promise<void> => {
    await delay(this.disappearanceMs)
    this.isOpened = false
    this.sharedPlayMethods.playerCharacter.removeMovementKeysProhibitor('transitionScreen')
  }

  run = async (): Promise<void> => {
    await this.open()
    await delay(this.durationMs)
    await this.close()
  }
}
