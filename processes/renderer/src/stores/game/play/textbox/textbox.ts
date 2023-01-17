import { Callback } from 'process-shared/types/basic-utility-types'

type TextboxConfig<Name extends string> = {
  name: Name
  text: string
  onOpen?: Callback
  onClose?: Callback
}

export class Textbox<TextboxName extends string> {
  name: TextboxName
  text: string

  constructor(config: TextboxConfig<TextboxName>) {
    const { name, text, onOpen, onClose } = config

    this.name = name
    this.text = text

    this.setCallbacks({ onOpen, onClose })
  }

  onOpen?: Callback
  onClose?: Callback
  setCallbacks = ({ onOpen, onClose }: { onOpen?: Callback; onClose?: Callback }): void => {
    this.onOpen = onOpen
    this.onClose = onClose
  }
}
