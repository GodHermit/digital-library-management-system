import { Textarea, TextAreaProps } from '@heroui/react';
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

export type IControlledControlledTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'>  &
  TextAreaProps;

export function ControlledTextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: IControlledControlledTextAreaProps<
    TFieldValues,
    TName,
    TTransformedValues
  >
) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState: { invalid, error } }) => (
        <Textarea
          labelPlacement="outside"
          variant="bordered"
          placeholder=" "
          validationBehavior="aria"
          isRequired={!!props.rules?.required}
          errorMessage={error?.message}
          isInvalid={invalid}
          {...props}
          {...field}
        />
      )}
    />
  );
}
