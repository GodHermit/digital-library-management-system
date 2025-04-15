import { Input, InputProps } from '@heroui/react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

export type IControlledFiledProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> &
  InputProps;

export function ControlledInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: IControlledFiledProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState: { invalid, error } }) => (
        <Input
          labelPlacement="outside"
          type="text"
          variant="bordered"
          placeholder=" "
          isRequired={!!props.rules?.required}
          validationBehavior="aria"
          errorMessage={error?.message}
          isInvalid={invalid}
          {...props}
          {...field}
        />
      )}
    />
  );
}
