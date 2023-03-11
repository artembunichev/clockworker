import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components';

import { FC } from 'basic-utility-types';

import { colors } from 'lib/theme';

import { FieldErrors } from './get-errors';

type Props = {
  errors: FieldErrors;
};

export const FieldErrorMessages: FC<Props> = observer( ( { errors } ) => {
  return (
    <>
      {errors.isEmpty.value && <FormErrorMessage>{errors.isEmpty.message}</FormErrorMessage>}
      {errors.isShort.value && <FormErrorMessage>{errors.isShort.message}</FormErrorMessage>}
      {errors.isSpecSymbols.value && (
        <FormErrorMessage>{errors.isSpecSymbols.message}</FormErrorMessage>
      )}
    </>
  );
} );

const FormErrorMessage = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6px;
  color: ${colors.error};
  text-align: center;
`;
