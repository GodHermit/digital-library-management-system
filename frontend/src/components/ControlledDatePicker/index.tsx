import { DatePicker, DatePickerProps } from '@heroui/react';
import { parseAbsolute } from '@internationalized/date';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

export type IControlledDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> &
  DatePickerProps;

export function ControlledDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: IControlledDatePickerProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState: { invalid, error } }) => (
        <DatePicker
          labelPlacement="outside"
          variant="bordered"
          isRequired={!!props.rules?.required}
          validationBehavior="aria"
          errorMessage={error?.message}
          showMonthAndYearPickers
          isInvalid={invalid}
          {...props}
          {...field}
          value={field.value ? parseAbsolute(field.value, 'Europe/Kyiv') : undefined}
          onChange={value => {
            field.onChange(value?.toDate('Europe/Kyiv').toISOString());
            props.onChange?.(value);
          }}
        />
      )}
    />
  );
}
