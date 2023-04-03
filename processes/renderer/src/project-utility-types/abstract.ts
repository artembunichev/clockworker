export type Size = {
  width: number
  height: number
}

export type Indexes = [ number, number ]

export type Reducer<T> = ( prevValue: T ) => T

export type Modifier<T> = Reducer<T> | T
