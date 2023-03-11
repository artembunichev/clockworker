import { makeAutoObservable } from 'mobx';

import { isEqual } from 'shared/lib/is-equal';

import { EditableSettingVariants } from './types';

export const getVariantsWithInitialValue = <T>(
  variants: EditableSettingVariants<T>,
  initialValue: T,
): EditableSettingVariants<T> => {
  return variants.map( ( variant ) => {
    if ( isEqual( variant.value, initialValue ) ) {
      return {
        ...variant,
        isSelected: true,
      };
    } else {
      return {
        ...variant,
        isSelected: false,
      };
    }
  } );
};

type Config<Value> = {
  id: string;
  variants: EditableSettingVariants<Value>;
  initialValue?: Value;
};

// можно выбрать только один вариант
export class RadioSetting<Value> {
  id: string;
  variants: EditableSettingVariants<Value>;

  constructor( config: Config<Value> ) {
    const { id, variants, initialValue } = config;

    this.id = id;

    if ( initialValue ) {
      const variantsWithInitialValue = getVariantsWithInitialValue( variants, initialValue );
      this.variants = variantsWithInitialValue;
    } else {
      this.variants = variants;
    }

    makeAutoObservable( this );
  }

  selectVariant = ( variantId: string ): void => {
    this.variants.forEach( ( variant ) => {
      if ( variant.id === variantId ) {
        variant.isSelected = true;
      } else {
        variant.isSelected = false;
      }
    } );
  };

  get value(): Value {
    return this.variants.find( ( v ) => v.isSelected )!.value;
  }
}
