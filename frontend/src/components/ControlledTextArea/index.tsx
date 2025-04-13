import { Textarea, TextAreaProps } from '@heroui/react';
import { Controller, ControllerProps } from 'react-hook-form';

export type IControlledControlledTextAreaProps = Omit<
  ControllerProps,
  'render'
> &
  TextAreaProps;

export function ControlledTextArea(props: IControlledControlledTextAreaProps) {
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
