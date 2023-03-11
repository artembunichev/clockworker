import { makeAutoObservable } from 'mobx';

// настройка, содержащая в себе одно значение
export class SingleValueSetting<Value> {
  id: string;
  value: Value;

  constructor( id: string, initialValue: Value ) {
    this.id = id;
    this.setValue( initialValue );

    makeAutoObservable( this );
  }

  setValue = ( value: Value ): void => {
    this.value = value;
  };
}
