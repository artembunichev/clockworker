import { CheckboxSetting } from './checkbox-setting';
import { RadioSetting } from './radio-setting';
import { SingleValueSetting } from './single-value-setting';

export type EditableSetting<T> = CheckboxSetting<T> | RadioSetting<T> | SingleValueSetting<T>;

export type AnyEditableSetting = CheckboxSetting<any> | RadioSetting<any> | SingleValueSetting<any>;

export type EditableSettingVariant<T> = {
  id: string;
  label: string;
  value: T;
  isSelected: boolean;
};

export type EditableSettingVariants<T> = Array<EditableSettingVariant<T>>;
