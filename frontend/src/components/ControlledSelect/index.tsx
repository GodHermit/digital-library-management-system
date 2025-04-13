import { Select, SelectProps } from '@heroui/react';
import { Controller, ControllerProps } from 'react-hook-form';

export type IControlledSelectProps<T extends object> = Omit<
  ControllerProps,
  'render'
> &
  SelectProps<T>;

export function ControlledSelect<T extends object>(
  props: IControlledSelectProps<T>
) {
  return (
    <Controller
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
          selectedKeys={
            Array.isArray(field.value) ? field.value : [field.value]
          }
          {...props}
          {...field}
        />
      )}
    />
  );
}
