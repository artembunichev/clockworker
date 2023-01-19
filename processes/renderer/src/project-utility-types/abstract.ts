export type Size = {
  width: number
  height: number
}

export type Indexes = [number, number]

export type Modifier<T> = ((prevValue: T) => T) | T
