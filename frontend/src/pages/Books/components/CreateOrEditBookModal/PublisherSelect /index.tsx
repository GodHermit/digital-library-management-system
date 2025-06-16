import { ControlledSelect } from '@/components/ControlledSelect';
import { useGetPublishersQuery } from '@/hooks/useGetPublishersQuery';
import { publisherService } from '@/services/publisherService';
import { useUserStore } from '@/stores/user';
import { IBookCreate } from '@/types/book';
import { EUserRole } from '@/types/user';
import { addErrorToast } from '@/utils/errorToast';
import { Button, SelectItem } from '@heroui/react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { PublisherPopover } from './PublisherPopover';

export function PublisherSelect() {
  const {
    data: publishers,
    isLoading: isPublishersLoading,
    mutate: mutatePublishers,
  } = useGetPublishersQuery();
  const [isPublisherSubmitting, setIsPublisherSubmitting] = useState(false);
  const form = useFormContext<IBookCreate>();
  const user = useUserStore(useShallow(s => s.user));

  if (!form) {
    throw new Error('PublisherSelect must be used within a FormProvider');
  }

  const handleDeletePublisher = async (id: string) => {
    try {
      setIsPublisherSubmitting(true);
      await publisherService.deletePublisher(id);
      form.setValue('publisherId', id);
      await mutatePublishers();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsPublisherSubmitting(false);
    }
  };

  return (
    <ControlledSelect
      name="publisherId"
      control={form.control}
      label="Видавництва"
      selectionMode="single"
      isLoading={isPublishersLoading || isPublisherSubmitting}
      isDisabled={isPublishersLoading || isPublisherSubmitting}
      isVirtualized={(publishers?.length ?? 0) > 10}
      items={publishers ?? []}
      itemHeight={48}
      as="div"
      endContent={
        <PublisherPopover
          isLoading={isPublisherSubmitting}
          onSuccess={publisher => {
            mutatePublishers();
            form.setValue('publisherId', publisher.id);
          }}
        />
      }
    >
      {publisher => (
        <SelectItem key={publisher.id} textValue={publisher.name} as="div">
          <div className="flex w-full grow items-center gap-2">
            <span className="text-small">{publisher.name}</span>
            {user?.role === EUserRole.ADMIN && (
              <div className="ml-auto flex items-center gap-2">
                <PublisherPopover
                  isLoading={isPublisherSubmitting}
                  publisher={publisher}
                  icon={<PencilIcon width={16} height={16} />}
                  onSuccess={publisher => {
                    mutatePublishers();
                    form.setValue('publisherId', publisher.id);
                  }}
                />
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => handleDeletePublisher(publisher.id)}
                >
                  <TrashIcon width={16} height={16} />
                </Button>
              </div>
            )}
          </div>
        </SelectItem>
      )}
    </ControlledSelect>
  );
}
