import { computed, makeObservable, observable } from 'mobx'

import { Callback, Properties } from 'basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { GamePauseController } from '../pause-controller'
import { WelcomeTextbox } from './list/welcome'

type This = InstanceType<typeof TextboxController>

type TextboxInController = InstanceType<Properties<This['refList']>>
type List = Record<keyof This['refList'], TextboxInController>
type TextboxName = keyof This['refList']

type SetTextboxConfig = {
  name: TextboxName
  onOpen?: Callback
  onClose?: Callback
}

type TextboxControllerConfig = {
  gameScript: GameScript
  pauseController: GamePauseController
}
export class TextboxController {
  private gameScript: GameScript
  private pauseController: GamePauseController

  internalOnOpen: Callback
  internalOnClose: Callback

  constructor(config: TextboxControllerConfig) {
    this.gameScript = config.gameScript
    this.pauseController = config.pauseController

    this.internalOnOpen = this.pauseController.onPause
    this.internalOnClose = this.pauseController.onResume

    makeObservable(this, { list: observable, currentTextbox: observable, isTextboxOpened: computed })
  }

  //Список текстбоксов, использующихся в контроллере
  private refList = { welcome: WelcomeTextbox }

  //Список созданных текстбоксов
  list: List = {} as List

  createTextbox = (name: TextboxName): void => {
    this.list[name] = new this.refList[name]({ gameScript: this.gameScript })
  }

  currentTextbox: TextboxInController | null = null

  setCurrentTextbox = ({ name, onOpen, onClose }: SetTextboxConfig): void => {
    if (!this.list[name]) {
      this.createTextbox(name)
    }

    this.currentTextbox = this.list[name]
    this.internalOnOpen()
    this.currentTextbox.setCallbacks({ onOpen, onClose })
    this.currentTextbox.onOpen?.()
  }

  closeCurrentTextbox = (): void => {
    if (this.currentTextbox) {
      this.internalOnClose()
      this.currentTextbox.onClose?.()
    }
    this.currentTextbox = null
  }

  get isTextboxOpened(): boolean {
    return Boolean(this.currentTextbox)
  }
}
