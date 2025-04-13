import { DatePicker, DatePickerProps } from '@heroui/react';
import { Controller, ControllerProps } from 'react-hook-form';

export type IControlledDatePickerProps = Omit<ControllerProps, 'render'> &
  DatePickerProps;

export function ControlledDatePicker(props: IControlledDatePickerProps) {
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
        />
      )}
    />
  );
}
