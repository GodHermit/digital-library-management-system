import { TARGET_CHAIN } from '@/configs/wagmi';
import { NumberInput, NumberInputProps } from '@heroui/react';
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

export type IControlledNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> &
  NumberInputProps;

export function ControlledNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: IControlledNumberInputProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState: { invalid, error } }) => (
        <NumberInput
          labelPlacement="outside"
          variant="bordered"
          placeholder=" "
          isRequired={!!props.rules?.required}
          validationBehavior="aria"
          errorMessage={error?.message}
          isInvalid={invalid}
          formatOptions={{
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: TARGET_CHAIN.nativeCurrency.decimals,
          }}
          {...props}
          {...field}
          onChange={element => {
            const value = element;
            if (!isNaN(+value.toString())) {
              field.onChange(value);
            }
          }}
        />
      )}
    />
  );
}
