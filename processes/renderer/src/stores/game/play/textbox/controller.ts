import { computed, makeObservable, observable } from 'mobx'

import { Callback, PropertyOf } from 'shared/types/basic-utility-types'

import { GameScript } from 'content/text/game-script'

import { GamePauseController } from '../pause-controller'
import { WelcomeTextbox } from './list/welcome'

type TextboxInController = InstanceType<PropertyOf<TextboxController['refList']>>
type TextboxName = keyof TextboxController['refList']
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

  // список текстбоксов, использующихся в контроллере
  private refList = { welcome: WelcomeTextbox }
  // список созданных текстбоксов
  textboxes: Textboxes = {} as Textboxes
  currentTextbox: TextboxInController | null = null

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

  createTextbox = (name: TextboxName): void => {
    this.textboxes[name] = new this.refList[name]({ gameScript: this.gameScript })
  }

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
