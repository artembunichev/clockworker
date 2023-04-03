import { isObject, objectMapAll } from './objects'

export const deepClone = <T>( value: T ): T => {
	if ( isObject( value ) ) {
		return objectMapAll( value, ( child ) => deepClone( child ) ) as unknown as T
	} else if ( Array.isArray( value ) ) {
		return value.map( ( child: typeof value[ number ] ) => deepClone( child ) ) as unknown as T
	} else {
		return value
	}
}
