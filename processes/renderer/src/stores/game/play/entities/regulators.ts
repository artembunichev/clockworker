import { AnyObject, Callback } from 'process-shared/types/basic-utility-types'
import { Modifier } from 'project-utility-types/abstract'

import { remove } from 'lib/arrays'

type Regulator<Target extends string> = Record<Target, Modifier<any>>

export type RegulatorList<Name extends string, Target extends string> = Record<Name, Regulator<Target>>
type AnyRegulatorList = RegulatorList<string, string>

export type RegulatorName<RL extends AnyRegulatorList> = keyof RL
export type RegulatorTarget<RL extends AnyRegulatorList> = Extract<keyof RL[keyof RL], string>

export type RegulatorTargetsInitialValues<Target extends string> = Record<Target, string>

type RegulatorsConfig<RL extends AnyRegulatorList> = {
  sourceObject: AnyObject
  targetsInitialValues: RegulatorTargetsInitialValues<RegulatorTarget<RL>>
}

type Config<RL extends AnyRegulatorList> = {
  list: RL
} & RegulatorsConfig<RL>

export class Regulators<RL extends AnyRegulatorList> {
  list: RL

  private config: RegulatorsConfig<RL>

  constructor(config: Config<RL>) {
    const { list, sourceObject, targetsInitialValues } = config

    this.list = list
    this.setConfig({ sourceObject, targetsInitialValues })
  }

  private setConfig = (config: RegulatorsConfig<RL>): void => {
    this.config = config
  }

  activeRegulatorNames: Array<RegulatorName<RL>> = []

  isRegulatorActive = (regulatorName: RegulatorName<RL>): boolean => {
    return this.activeRegulatorNames.includes(regulatorName)
  }

  private modifyTarget = <T>(target: RegulatorTarget<RL>, prevValue: T, initialValue: T): T => {
    const newValue = this.activeRegulatorNames.reduce((_: T, regulatorName) => {
      const regulator = this.list[regulatorName]
      const targetModifier = regulator[target] as Modifier<T>
      if (targetModifier instanceof Function) {
        return targetModifier(prevValue)
      } else {
        return targetModifier
      }
    }, initialValue)
    return newValue
  }

  private modifyRegulatorTarget = (regulatorName: RegulatorName<RL>): void => {
    const { sourceObject, targetsInitialValues } = this.config

    const targets = Object.keys(this.list[regulatorName]) as Array<RegulatorTarget<RL>>
    targets.forEach((target) => {
      const prevValue = sourceObject[target as keyof typeof sourceObject]
      const targetInitialValue = sourceObject[
        targetsInitialValues[target] as keyof typeof sourceObject
      ] as typeof prevValue

      sourceObject[target as keyof typeof sourceObject] = this.modifyTarget(
        target,
        prevValue,
        targetInitialValue,
      )
    })
  }

  modifyAllRegulatorTargets = (): void => {
    Object.keys(this.list).forEach((regulatorName) => {
      this.modifyRegulatorTarget(regulatorName)
    })
  }

  private makeRegulatorAction = (action: Callback): void => {
    action()
    this.modifyAllRegulatorTargets()
  }

  applyRegulator = (regulatorName: RegulatorName<RL>): void => {
    if (!this.isRegulatorActive(regulatorName)) {
      this.makeRegulatorAction(() => {
        this.activeRegulatorNames.push(regulatorName)
      })
    }
  }
  removeRegulator = (regulatorName: RegulatorName<RL>): void => {
    if (this.isRegulatorActive(regulatorName)) {
      this.makeRegulatorAction(() => {
        this.activeRegulatorNames = remove(this.activeRegulatorNames, regulatorName)
      })
    }
  }
  clearRegulators = (): void => {
    this.makeRegulatorAction(() => {
      this.activeRegulatorNames = []
    })
  }
}
