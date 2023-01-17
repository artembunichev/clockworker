import { computed, makeObservable, observable } from 'mobx'

import { Callback, Properties } from 'process-shared/types/basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { GamePauseController } from '../pause-controller'
import { WelcomeTextbox } from './list/welcome'

type This = InstanceType<typeof TextboxController>

type TextboxInController = InstanceType<Properties<This['refList']>>
type TextboxName = keyof This['refList']
type Textboxes = Record<TextboxName, TextboxInController>

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
    const { gameScript, pauseController } = config

    this.gameScript = gameScript
    this.pauseController = pauseController

    this.internalOnOpen = () => this.pauseController.onPause({ prohibitorName: 'textbox' })
    this.internalOnClose = () => this.pauseController.onResume({ prohibitorName: 'textbox' })

    makeObservable(this, {
      textboxes: observable,
      currentTextbox: observable,
      isTextboxOpened: computed,
    })
  }

  // список текстбоксов, использующихся в контроллере
  private refList = { welcome: WelcomeTextbox }

  // список созданных текстбоксов
  textboxes: Textboxes = {} as Textboxes

  createTextbox = (name: TextboxName): void => {
    this.textboxes[name] = new this.refList[name]({ gameScript: this.gameScript })
  }

  currentTextbox: TextboxInController | null = null

  setCurrentTextbox = ({ name, onOpen, onClose }: SetTextboxConfig): void => {
    if (!this.textboxes[name]) {
      this.createTextbox(name)
    }

    this.currentTextbox = this.textboxes[name]
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
