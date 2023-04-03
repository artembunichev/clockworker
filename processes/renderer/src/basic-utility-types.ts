import { PropsWithChildren, FC as ReactFC } from 'react'

export type FC<T = unknown> = ReactFC<PropsWithChildren<T>>
