import {
  AnyObject,
  Merge,
  OverwriteProperties,
  Properties,
} from 'process-shared/types/basic-utility-types'

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export const merge = <T1 extends AnyObject, T2 extends AnyObject>(
  object1: T1,
  object2: T2,
): Merge<T1, T2> => {
  const merged = { ...object1 }

  const mergeObjects = (target: AnyObject, source: AnyObject): void => {
    Object.keys(source).forEach((key) => {
      if (target[key] === undefined) {
        target[key] = source[key]
      } else {
        if (isObject(target[key]) && isObject(source[key])) {
          mergeObjects(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    })
  }

  mergeObjects(merged, object2)

  return merged as Merge<T1, T2>
}

type ObjectMapCallback<T, R> = (value: Properties<T>) => R
export const objectMap = <T extends AnyObject, R>(
  object: T,
  callback: ObjectMapCallback<T, R>,
): OverwriteProperties<T, R> => {
  return (Object.keys(object) as Array<keyof T>).reduce((result, key) => {
    result[key] = callback(object[key])
    return result
  }, {} as OverwriteProperties<T, R>)
}
