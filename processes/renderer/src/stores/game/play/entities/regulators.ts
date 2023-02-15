import { Callback } from 'process-shared/types/basic-utility-types'
import { Modifier } from 'project-utility-types/abstract'

import { remove } from 'lib/arrays'
import { objectKeys } from 'lib/objects'

export type Regulator<SO extends object, Target extends keyof SO> = Record<Target, Modifier<any>>
export type RegulatorList<SO extends object, Name extends string, Target extends keyof SO> = Record<
  Name,
  Regulator<SO, Target>
>

export type RegulatorTargetsInitialValues<SO extends object, Target extends keyof SO> = Record<
  Target,
  keyof SO
>

type InternalConfig<SO extends object, Target extends keyof SO> = {
  sourceObject: SO
  targetsInitialValues: RegulatorTargetsInitialValues<SO, Target>
}

type Config<SO extends object, Target extends keyof SO> = {
  targetsInitialValues: RegulatorTargetsInitialValues<SO, Target>
}

export class Regulators<SO extends object, Name extends string, Target extends keyof SO> {
  list: RegulatorList<SO, Name, Target>
  private config: InternalConfig<SO, Target>

  activeRegulatorNames: Array<Name> = []

  constructor(
    sourceObject: SO,
    regulatorList: RegulatorList<SO, Name, Target>,
    config: Config<SO, Target>,
  ) {
    const { targetsInitialValues } = config

    this.list = regulatorList
    this.setConfig({ sourceObject, targetsInitialValues })
  }

  private setConfig = (config: InternalConfig<SO, Target>): void => {
    this.config = config
  }

  isRegulatorActive = (regulatorName: Name): boolean => {
    return this.activeRegulatorNames.includes(regulatorName)
  }

  private getInitialTargetValue = (target: Target): any => {
    const { sourceObject, targetsInitialValues } = this.config
    return sourceObject[targetsInitialValues[target]]
  }

  private modifyTarget = (target: Target, value: any): void => {
    const { sourceObject } = this.config
    sourceObject[target] = value
  }

  private getNewTargetValue = <T>(target: Target): T => {
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

  private modifyRegulatorTargets = (regulatorName: Name, modifiedTargets: Array<Target>): void => {
    const targets = objectKeys(this.list[regulatorName]) as Array<Target>
    targets.forEach((target) => {
      if (!modifiedTargets.includes(target)) {
        const newTargetValue = this.getNewTargetValue(target)
        this.modifyTarget(target, newTargetValue)
        modifiedTargets.push(target)
      }
    })
  }

  modifyAllRegulatorTargets = (): void => {
    const modifiedTargets: Array<Target> = []
    const regulatorNames = objectKeys(this.list)
    regulatorNames.forEach((regulatorName) =>
      this.modifyRegulatorTargets(regulatorName, modifiedTargets),
    )
  }

  private makeRegulatorAction = (action: Callback): void => {
    action()
    this.modifyAllRegulatorTargets()
  }

  applyRegulator = (regulatorName: Name): void => {
    if (!this.isRegulatorActive(regulatorName)) {
      this.makeRegulatorAction(() => {
        this.activeRegulatorNames.push(regulatorName)
      })
    }
  }
  removeRegulator = (regulatorName: Name): void => {
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
