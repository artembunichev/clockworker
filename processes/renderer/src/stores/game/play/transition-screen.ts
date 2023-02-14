import { makeAutoObservable } from 'mobx'

import { delay } from 'lib/async'

import { SharedPlayMethods } from './shared-methods'

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

  isOpened = false

  constructor(config: TransitionScreenConfig) {
    const { appearanceMs, disappearanceMs, durationMs, background, sharedPlayMethods } = config

    this.appearanceMs = appearanceMs
    this.disappearanceMs = disappearanceMs
    this.durationMs = durationMs ?? 0
    this.background = background
    this.sharedPlayMethods = sharedPlayMethods

    makeAutoObservable(this)
  }

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
