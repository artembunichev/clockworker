import { PickKeyof } from 'shared/types/basic-utility-types';
import { RegulatorList, RegulatorTargetsInitialValues } from '../../entities/regulators';
import { CharacterMovementState } from './state';

export type CharacterMovementRegulatorName = 'sprint';

type CharacterMovementRegulatorTarget = PickKeyof<CharacterMovementState, 'currentStepSize'>;

export const characterMovementRegulatorTargetsInitialValues: RegulatorTargetsInitialValues<
  CharacterMovementState,
  CharacterMovementRegulatorTarget
> = {
  currentStepSize: 'baseStepSize',
};

export const characterMovementRegulatorList: RegulatorList<
  CharacterMovementState,
  CharacterMovementRegulatorName,
  CharacterMovementRegulatorTarget
> = {
  sprint: {
    currentStepSize: ( prev ) => prev * 2.1,
  },
};
