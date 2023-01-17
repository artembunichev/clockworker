import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

type IconProps = {
  src: string
  size: number
}
type IconPropsNoSrc = Omit<IconProps, 'src'>

export const Icon: FC<IconProps> = observer(({ src, size }) => {
  return <img src={src} width={size} height={size} />
})

export const createIconComponent = (src: IconProps['src']): FC<IconPropsNoSrc> => {
  const IconComponent: FC<IconPropsNoSrc> = observer(({ size }) => {
    return <Icon src={src} size={size} />
  })
  return IconComponent
}
