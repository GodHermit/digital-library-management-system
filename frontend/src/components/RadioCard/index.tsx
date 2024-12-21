import { cn, Radio, RadioProps } from '@nextui-org/react';

export const RadioCard = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 hover:bg-content2 items-center justify-between',
          'flex-row-reverse w-full max-w-none grow cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary'
        ),
      }}
    >
      {children}
    </Radio>
  );
};
