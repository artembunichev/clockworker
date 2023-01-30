import { AnyObject, Callback, Properties } from 'process-shared/types/basic-utility-types'
import { Modifier } from 'project-utility-types/abstract'

import { remove } from 'lib/arrays'

type Regulator<Target extends string> = Record<Target, Modifier<any>>

export type RegulatorList<Name extends string, Target extends string> = Record<Name, Regulator<Target>>
type AnyRegulatorList = RegulatorList<string, string>

export type RegulatorName<RL extends AnyRegulatorList> = Extract<keyof RL, string>
export type RegulatorTarget<RL extends AnyRegulatorList> = Extract<keyof Properties<RL>, string>

export type RegulatorTargetsInitialValues<
  SourceObject extends AnyObject,
  Target extends string,
> = Record<Target, keyof SourceObject>

type RegulatorsConfig<RL extends AnyRegulatorList, SO extends AnyObject> = {
  sourceObject: SO
  targetsInitialValues: RegulatorTargetsInitialValues<SO, RegulatorTarget<RL>>
}

type Config<RL extends AnyRegulatorList, SO extends AnyObject> = {
  list: RL
} & RegulatorsConfig<RL, SO>

export class Regulators<RL extends AnyRegulatorList, SO extends AnyObject> {
  list: RL
  private config: RegulatorsConfig<RL, SO>

  activeRegulatorNames: Array<RegulatorName<RL>> = []

  constructor(config: Config<RL, SO>) {
    const { list, sourceObject, targetsInitialValues } = config

    this.list = list
    this.setConfig({ sourceObject, targetsInitialValues })
  }

  private setConfig = (config: RegulatorsConfig<RL, SO>): void => {
    this.config = config
  }

  isRegulatorActive = (regulatorName: RegulatorName<RL>): boolean => {
    return this.activeRegulatorNames.includes(regulatorName)
  }

  private getInitialTargetValue = (target: RegulatorTarget<RL>): any => {
    const { sourceObject, targetsInitialValues } = this.config
    return sourceObject[targetsInitialValues[target]]
  }

  private modifyTarget = (target: RegulatorTarget<RL>, value: any): void => {
    const { sourceObject } = this.config
    sourceObject[target] = value
  }

  private getNewTargetValue = <T>(target: RegulatorTarget<RL>): T => {
    const initialTargetValue = this.getInitialTargetValue(target)
    const newValue = this.activeRegulatorNames.reduce((acc: T, regulatorName) => {
      const regulator = this.list[regulatorName]
      const targetModifier = regulator[target] as Modifier<T>
      if (targetModifier instanceof Function) {
        return targetModifier(acc)
      } else {
        return targetModifier
      }
    }, initialTargetValue)
    return newValue
  }

  private modifyRegulatorTargets = (
    regulatorName: RegulatorName<RL>,
    modifiedTargets: Array<RegulatorTarget<RL>>,
  ): void => {
    const targets = Object.keys(this.list[regulatorName]) as Array<RegulatorTarget<RL>>
    targets.forEach((target) => {
      if (!modifiedTargets.includes(target)) {
        const newTargetValue = this.getNewTargetValue(target)
        this.modifyTarget(target, newTargetValue)
        modifiedTargets.push(target)
      }
    })
  }

  modifyAllRegulatorTargets = (): void => {
    const modifiedTargets: Array<RegulatorTarget<RL>> = []
    Object.keys(this.list).forEach((regulatorName) =>
      this.modifyRegulatorTargets(regulatorName as RegulatorName<RL>, modifiedTargets),
    )
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
