import { makeAutoObservable } from 'mobx'

import { areEquivalent } from 'lib/are-equivalent'

import { EditableSettingVariants } from './types'

export const getVariantsWithInitialValues = <T>(
  variants: EditableSettingVariants<T>,
  initialValues: Array<T>,
): EditableSettingVariants<T> => {
  return variants.map((variant) => {
    if (initialValues.some((v) => areEquivalent(variant.value, v))) {
      return {
        ...variant,
        isSelected: true,
      }
    }
    return {
      ...variant,
      isSelected: false,
    }
  })
}

type Config<Value> = {
  id: string
  variants: EditableSettingVariants<Value>
  initialValues?: Array<Value>
}

// одновременно можно выбрать несколько вариантов
export class CheckboxSetting<Value> {
  id: string
  variants: EditableSettingVariants<Value>

  constructor(config: Config<Value>) {
    const { id, variants, initialValues } = config

    this.id = id

    if (initialValues) {
      const variantsWithInitialValue = getVariantsWithInitialValues(variants, initialValues)
      this.variants = variantsWithInitialValue
    } else {
      this.variants = variants
    }

    makeAutoObservable(this)
  }

  get value(): Array<Value> {
    return this.variants.reduce((acc, variant) => {
      if (variant.isSelected) {
        acc.push(variant.value)
      }
      return acc
    }, [] as Array<Value>)
  }

  selectVariant = (variantId: string): void => {
    this.variants.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = true
      }
    })
  }

  unselectVariant = (variantId: string): void => {
    this.variants.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = false
      }
    })
  }
}
