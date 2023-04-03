export const last = <T>( array: Array<T> ): T => {
  return array[ array.length - 1 ]
}

export type Remover<T> = ( value: T ) => boolean
export const remove = <T>( array: Array<T>, remover: T | Remover<T> ): Array<T> => {
  if ( remover instanceof Function ) {
    return array.filter( ( el ) => !remover( el ) )
  } else {
    return array.filter( ( el ) => el !== remover )
  }
}

export const removeOnce = <T>( array: Array<T>, value: T ): Array<T> => {
  const resultArray: Array<T> = [ ...array ]

  const valueIndex = array.indexOf( value )
  if ( valueIndex > -1 ) {
    resultArray.splice( valueIndex, 1 )
  }

  return resultArray
}

export const countOf = <T>( array: Array<T>, callback: ( value: T ) => boolean ): number => {
  return array.filter( callback ).length ?? 0
}
