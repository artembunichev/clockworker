import { Remover, remove } from 'process-shared/lib/arrays'

type RemoveOneArg<T, Id extends keyof T> = Id extends null ? T : T[Id]
type RemoverManyArg<T, Id extends keyof T> = Id extends null ? Array<T> : Array<T[Id]>

type Config<T, Id extends keyof T> = {
  identifier?: Id
}

export class List<T, Id extends keyof T> {
  elements: Array<T>
  private identifier: Id | null = null

  constructor(list: Array<T>, config?: Config<T, Id>) {
    this.elements = list

    const { identifier } = config ?? {}
    if (identifier) {
      this.identifier = identifier
    }
  }

  addOne = (element: T): void => {
    this.elements.push(element)
  }
  addMany = (elements: Array<T>): void => {
    elements.forEach(this.addOne)
  }

  removeOne = (arg: RemoveOneArg<T, Id>): void => {
    var remover: T | Remover<T>
    if (this.identifier !== null) {
      remover = (element: T) => {
        return element[this.identifier as keyof T] === arg
      }
    } else {
      remover = arg as T
    }

    this.elements = remove(this.elements, remover)
  }
  removeMany = (args: RemoverManyArg<T, Id>): void => {
    args.forEach((arg) => this.removeOne(arg as RemoveOneArg<T, Id>))
  }

  clear = (): void => {
    this.elements = []
  }
}
