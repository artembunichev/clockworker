import { AnyObject } from 'process-shared/types/basic-utility-types'

import { isObject } from './objects'

const areEquivalentArrays = (array1: Array<any>, array2: Array<any>): boolean => {
  const length1 = array1.length
  const length2 = array2.length

  if (length1 === length2) {
    return array1.every((el, index) => areEquivalent(el, array2[index]))
  }

  return false
}

const areEquivalentObjects = (object1: AnyObject, object2: AnyObject): boolean => {
  const length1 = Object.keys(object1).length
  const length2 = Object.keys(object2).length

  if (length1 === length2) {
    return Object.keys(object1).every((key) => areEquivalent(object1[key], object2[key]))
  }

  return false
}

export const areEquivalent = (value1: any, value2: any): boolean => {
  if (typeof value1 === typeof value2) {
    if (isObject(value1) && isObject(value2)) {
      return areEquivalentObjects(value1, value2)
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      return areEquivalentArrays(value1, value2)
    } else if (isNaN(value1) && isNaN(value2)) {
      return true
    } else {
      return value1 === value2
    }
  }

  return false
}
