import {
  AnyObject,
  Keys,
  Merge,
  OverwriteProperties,
  Properties,
} from 'process-shared/types/basic-utility-types'

export const isObject = (value: any): value is object => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export const objectKeys = <T extends object>(o: T): Keys<T> => {
  return Object.keys(o) as Keys<typeof o>
}

export const merge = <T1 extends AnyObject, T2 extends AnyObject>(
  object1: T1,
  object2: T2,
): Merge<T1, T2> => {
  const merged = { ...object1 }

  const mergeObjects = (target: AnyObject, source: AnyObject): void => {
    objectKeys(source).forEach((key) => {
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

// использовать только в случае, если все свойства будут иметь одинаковый тип
type ObjectMapCallback<T, R> = (value: Properties<T>) => R
export const objectMapAll = <T extends AnyObject, R>(
  object: T,
  callback: ObjectMapCallback<T, R>,
): OverwriteProperties<T, R> => {
  return objectKeys(object).reduce((result, key) => {
    result[key] = callback(object[key])
    return result
  }, {} as OverwriteProperties<T, R>)
}
