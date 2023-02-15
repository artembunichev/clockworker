import { AnyObject } from 'process-shared/types/basic-utility-types'

import { objectKeys } from './objects'

const areEquivalentObjects = (object1: AnyObject, object2: AnyObject): boolean => {
  const length1 = objectKeys(object1).length
  const length2 = objectKeys(object2).length

  if (length1 === length2) {
    return objectKeys(object1).every((key) => areEquivalent(object1[key], object2[key]))
  }

  return false
}

export const areEquivalent = (value1: any, value2: any): boolean => {
  if (typeof value1 === typeof value2) {
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return areEquivalentObjects(value1, value2)
    } else if (isNaN(value1) && isNaN(value2)) {
      return true
    } else {
      return value1 === value2
    }
  }

  return false
}
