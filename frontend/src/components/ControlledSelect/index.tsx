import { Select, SelectProps } from '@heroui/react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

export type IControlledSelectProps<
  T extends object,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> &
  SelectProps<T>;

export function ControlledSelect<
  T extends object,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: IControlledSelectProps<T, TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller<TFieldValues, TName, TTransformedValues>
      {...props}
      render={({ field, fieldState: { invalid, error } }) => (
        <Select
          labelPlacement="outside"
          variant="bordered"
          placeholder=" "
          isRequired={!!props.rules?.required}
          validationBehavior="aria"
          errorMessage={error?.message}
          isInvalid={invalid}
          {...props}
          {...field}
          onChange={e => {
            field.onChange([
              ...new Set(e.target.value.split(',').filter(Boolean)),
            ]);
          }}
          selectedKeys={
            Array.isArray(field.value) ? field.value : [field.value]
          }
        />
      )}
    />
  );
}
