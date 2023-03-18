import { useEffect } from 'react';
import { predicate } from 'shared/lib/boolean';
import { Callback } from 'shared/types/basic-utility-types';

const isWindow = ( element: unknown ): element is Window => {
  return element === window;
};

export type UseKeyVariant = {
  when: unknown;
  fn: Callback;
};

export type UseKeyConfig = {
  element?: HTMLElement | Window | null;
  key: string;
  defaultFn: Callback;
  variants?: Array<UseKeyVariant>;
  ignoreWhen?: unknown | Array<unknown>;
};

export const useKey = (
  { element = window, key, defaultFn, variants, ignoreWhen }: UseKeyConfig,
  deps?: Array<any>,
): void => {
  const fn: Callback = () => {
    const isIgnore = Array.isArray( ignoreWhen ) ? ignoreWhen.some( predicate ) : predicate( ignoreWhen );

    if ( !isIgnore ) {
      var isVariantTriggered = false;

      variants?.forEach( ( variant ) => {
        if ( predicate( variant.when ) ) {
          variant.fn();
          isVariantTriggered = true;
        }
      } );

      if ( !isVariantTriggered ) {
        defaultFn();
      }
    }
  };

  useEffect( () => {
    const onKeyDown = ( e: Event ): void => {
      const { code } = e as KeyboardEvent;
      if ( code === key ) {
        fn();
      }
    };

    if ( element ) {
      if ( !isWindow( element ) ) {
        element.tabIndex = 0;
      }
      element.addEventListener( 'keydown', onKeyDown );
    }

    return () => element?.removeEventListener( 'keydown', onKeyDown );
  }, [ element, fn, ...( deps ?? [] ) ] );
};
