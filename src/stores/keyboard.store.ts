import { makeAutoObservable } from 'mobx'

export class KeyboardStore {
  constructor() {
    window.addEventListener('keydown', (e) => {
      this.pressedKeys.add(e.code)
    })
    window.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.code)
    })
    // Очищение нажатых клавиш при alt+tab/win+d/смене вкладки
    window.addEventListener('focus', () => {
      this.pressedKeys = new Set()
    })

    makeAutoObservable(this)
  }

  private pressedKeys: Set<string> = new Set()

  get pressedKeysArray(): Array<string> {
    return Array.from(this.pressedKeys)
  }
  get lastPressedKey(): string | null {
    return this.pressedKeysArray[this.pressedKeysArray.length - 1] ?? null
  }
}
