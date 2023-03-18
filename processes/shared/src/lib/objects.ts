import {
  Entries,
  Keys,
  Merge,
  OverwriteProperties,
  Properties,
  PropertyOf
} from 'shared/types/basic-utility-types';
import { deepClone } from './deep-clone';

export const isObject = ( value: any ): value is object => {
  return typeof value === 'object' && !Array.isArray( value ) && value !== null;
};

export const objectKeys = <T extends object>( o: T ): Keys<T> => {
  return Object.keys( o ) as Keys<T>;
};

export const objectValues = <T extends object>( o: T ): Properties<T> => {
  return Object.values( o ) as Properties<T>;
};

export const objectEntries = <T extends object>( o: T ): Entries<T> => {
  return Object.entries( o ) as Entries<T>;
};

export const merge = <T1 extends object, T2 extends object>(
  object1: T1,
  object2: T2,
): Merge<T1, T2> => {
  const merged = {} as Merge<T1, T2>;

  const overwrite = <T extends object>( object: T, key: keyof T, value: any ): void => {
    object[ key ] = deepClone( value );
  };

  const copyValues = ( source: object, target: object ): void => {
    objectKeys( source ).forEach( ( key ) => {
      if ( target[ key ] === undefined ) {
        overwrite( target, key, source[ key ] );
      } else {
        if ( isObject( target[ key ] ) && isObject( source[ key ] ) ) {
          copyValues( source[ key ], target[ key ] );
        } else {
          overwrite( target, key, source[ key ] );
        }
      }
    } );
  };

  Array.from( [ object1, object2 ] ).forEach( ( obj ) => {
    copyValues( obj, merged );
  } );

  return merged;
};

// использовать только в случае, если все свойства будут иметь одинаковый тип
type ObjectMapCallback<T, R> = ( value: PropertyOf<T> ) => R;
export const objectMapAll = <T extends object, R>(
  object: T,
  callback: ObjectMapCallback<T, R>,
): OverwriteProperties<T, R> => {
  return objectKeys( object ).reduce( ( result, key ) => {
    result[ key ] = callback( object[ key ] );
    return result;
  }, {} as OverwriteProperties<T, R> );
};

export const objectLength = ( obj: object ): number => {
  return objectKeys( obj ).length;
};
