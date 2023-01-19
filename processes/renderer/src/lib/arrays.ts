export const last = <T>(array: Array<T>): T => {
  return array[array.length - 1]
}
export const remove = <T>(array: Array<T>, value: T | ((value: T) => boolean)): Array<T> => {
  if (value instanceof Function) {
    return array.filter((el) => !value(el))
  } else {
    return array.filter((el) => el !== value)
  }
}

export const removeOnce = <T>(array: Array<T>, value: T): Array<T> => {
  const resultArray: Array<T> = [...array]

  const valueIndex = array.indexOf(value)
  if (valueIndex > -1) {
    resultArray.splice(valueIndex, 1)
  }

  return resultArray
}

export const countOf = <T>(array: Array<T>, callback: (value: T) => boolean): number => {
  return array.filter(callback).length ?? 0
}
