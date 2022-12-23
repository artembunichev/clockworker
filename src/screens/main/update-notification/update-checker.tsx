import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { UpdatePopup } from './update-popup'

export const UpdateChecker: FC = observer(() => {
  const { updateStore } = useStore()

  if (!updateStore) {
    return null
  }

  return <UpdatePopup updateStore={updateStore} />
})
