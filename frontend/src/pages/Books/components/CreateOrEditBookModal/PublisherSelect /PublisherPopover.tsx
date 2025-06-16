// 1. Polish admin functions for digital-library
// 2. Remove links to pages that are not existing yet
// 3. Create page for users to publish their books

import { ControlledInput } from '@/components/ControlledInput';
import { publisherService } from '@/services/publisherService';
import { IPublisher, IPublisherCreate } from '@/types/publisher';
import { addErrorToast } from '@/utils/errorToast';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface IPublisherPopoverProps {
  isLoading: boolean;
  icon?: React.ReactNode;
  publisher?: IPublisher;
  onSuccess?: (publisher: IPublisher) => void;
}

export function PublisherPopover({
  isLoading,
  icon,
  publisher,
  onSuccess,
}: IPublisherPopoverProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<IPublisherCreate>({
    values: {
      name: publisher?.name || '',
      website: publisher?.website || '',
    },
  });

  const handleAddOrEditPublisher = async (formData: IPublisherCreate) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) return;
      setIsSubmitting(true);

      if (publisher) {
        // Update existing publisher
        const updatedPublisher = await publisherService.updatePublisher(
          publisher.id,
          formData
        );
        onSuccess?.(updatedPublisher);
      } else {
        // Create new publisher
        const newPublisher = await publisherService.createPublisher(formData);
        onSuccess?.(newPublisher);
      }

      form.reset();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover size="lg" onClose={() => form.reset()}>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          isLoading={isLoading || isSubmitting}
        >
          {icon ? icon : <PlusIcon width={16} height={16} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {titleProps => (
          <div className="w-full px-1 py-2">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Додати видавництво
            </p>
            <FormProvider {...form}>
              <form className="mt-2 flex w-full flex-col gap-4">
                <ControlledInput
                  name="name"
                  control={form.control}
                  label="Назва видавництва"
                  autoComplete="off"
                  isDisabled={isLoading || isSubmitting}
                  rules={{
                    required: "Це поле є обов'язковим",
                  }}
                />
                <ControlledInput
                  name="website"
                  control={form.control}
                  label="Вебсайт видавництва"
                  type="url"
                  placeholder="https://example.com"
                  // autoComplete="off"
                  isDisabled={isLoading || isSubmitting}
                  rules={{
                    required: "Це поле є обов'язковим",
                  }}
                />
                <Button
                  onPress={() => handleAddOrEditPublisher(form.getValues())}
                  color="primary"
                  isLoading={isSubmitting}
                >
                  Зберегти
                </Button>
              </form>
            </FormProvider>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
