import { Input, InputProps } from '@heroui/react';
import { Controller, ControllerProps } from 'react-hook-form';

export type IControlledInputProps = Omit<ControllerProps, 'render'> &
  InputProps;

export function ControlledInput(props: IControlledInputProps) {
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
