import { ControlledDatePicker } from '@/components/ControlledDatePicker';
import { ControlledInput } from '@/components/ControlledInput';
import { ControlledNumberInput } from '@/components/ControlledNumberInput';
import { ControlledSelect } from '@/components/ControlledSelect';
import { ControlledTextArea } from '@/components/ControlledTextArea';
import { UploadFileButton } from '@/components/UploadFileButton';
import { useGetPublishersQuery } from '@/hooks/useGetPublishersQuery';
import { useGetUsersQuery } from '@/hooks/useGetUsersQuery';
import { priceService } from '@/services/priceService';
import { IBook, IBookUpdate } from '@/types/book';
import { addErrorToast } from '@/utils/errorToast';
import { toFixed } from '@/utils/number';
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
} from '@heroui/react';
import {
  getLocalTimeZone,
  parseAbsolute,
  today,
} from '@internationalized/date';
import { ArrowUpFromLineIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { cloneElement, ReactElement, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface IEditBookModalProps {
  book?: IBook;
  children?: ReactElement;
  onSuccess?: () => void;
}

export function CreateOrEditBookModal({
  book,
  children,
  onSuccess,
}: IEditBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!book;
  const { data: publishers, isLoading: isPublishersLoading } =
    useGetPublishersQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({
    page: 1,
    limit: Number.POSITIVE_INFINITY,
    sortBy: ['fullName:ASC'],
  });

  const form = useForm<IBookUpdate>({
    values: isEditMode
      ? {
          title: book.title,
          description: book.description,
          publishedAt: parseAbsolute(book.publishedAt, 'Europe/Kyiv'),
          publishedByUserId: book.publishedBy?.id,
          language: book.language,
          coverUrl: book.coverUrl,
          priceInETH: book.priceInETH.toString(),
          publisherId: book.publisher?.id,
          authorIds: book.authors?.map(author => author.id) || [],
          genreIds: book.genres.map(genre => genre.id),
          seriesId: book.seriesId,
          edition: book.edition,
          format: book.format,
          fileUrl: book.fileUrl,
          asin: book.asin,
          isbn: book.isbn,
        }
      : undefined,
  });

  const ethPriceInUSD = useMemo(() => priceService.get('eth'), []);
  const price = useWatch({
    control: form.control,
    name: 'priceInETH',
  });

  const handleSubmit = async (formData: IBookUpdate) => {
    try {
      setIsSubmitting(true);

      console.log('Form data:', formData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);

    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <>
      {children &&
        cloneElement(children, {
          onPress: () => {
            children?.props.onPress?.();
            setIsOpen(true);
          },
        })}
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        backdrop="blur"
        closeButton={false}
        hideCloseButton
        isDismissable={!isSubmitting}
      >
        <Form
          validationBehavior="native"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className="flex items-center gap-2 px-4">
                  {!isEditMode && (
                    <>
                      <PlusIcon />
                      Додати книгу
                    </>
                  )}
                  {isEditMode && (
                    <>
                      <PencilIcon />
                      Редагувати книгу
                    </>
                  )}
                </ModalHeader>
                <ModalBody className="max-h-[calc(100vh-400px)] overflow-y-auto px-4 pb-4 pt-0">
                  <div className="flex flex-col gap-4">
                    <ControlledInput
                      name="title"
                      control={form.control}
                      label="Назва книги"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledTextArea
                      name="description"
                      description="Підтримує Markdown форматування"
                      control={form.control}
                      label="Опис книги"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledDatePicker
                      name="publishedAt"
                      control={form.control}
                      label="Дата публікації"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                      maxValue={today(getLocalTimeZone())}
                    />
                    <ControlledSelect
                      name="publishedByUserId"
                      control={form.control}
                      label="Користувач, який опублікував книгу"
                      isLoading={isUsersLoading}
                      isDisabled={isUsersLoading}
                      isVirtualized={(users?.data?.length ?? 0) > 10}
                      items={users?.data ?? []}
                      itemHeight={48}
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    >
                      {user => (
                        <SelectItem key={user.id} textValue={user.fullName}>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-small">
                                {user.fullName}
                              </span>
                              <span className="text-tiny text-default-400">
                                {user.email || user.phone}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </ControlledSelect>
                    <ControlledInput
                      name="language"
                      control={form.control}
                      label="Мова книги"
                      description="Код мови згідно стандарту ISO 639-1"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="coverUrl"
                      control={form.control}
                      label="URL обкладинки книги"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                      placeholder="https://example.com/cover.jpg"
                      endContent={
                        <UploadFileButton
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onSuccess={files => {
                            form.setValue('coverUrl', files[0].url);
                          }}
                        >
                          <ArrowUpFromLineIcon width={16} height={16} />
                        </UploadFileButton>
                      }
                    />
                    <ControlledNumberInput
                      name="priceInETH"
                      control={form.control}
                      label="Ціна в ETH"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                      minValue={0}
                      hideStepper
                      endContent={
                        <div className="flex items-center gap-1">
                          ETH{' '}
                          <span className="text-zinc-500">
                            (~${toFixed(+(price || 0) * ethPriceInUSD.usd, 2)})
                          </span>
                        </div>
                      }
                    />
                    <ControlledSelect
                      name="publisherId"
                      control={form.control}
                      label="Видавництво"
                      isLoading={isPublishersLoading}
                      isDisabled={isPublishersLoading}
                      items={publishers ?? []}
                    >
                      {publisher => (
                        <SelectItem
                          key={publisher.id}
                          textValue={publisher.name}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-small">
                                {publisher.name}
                              </span>
                              <span className="text-tiny text-default-400">
                                {publisher.website}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </ControlledSelect>
                    <ControlledSelect
                      name="authorIds"
                      control={form.control}
                      label="Автори"
                      selectionMode="multiple"
                      isLoading={isUsersLoading}
                      isDisabled={isUsersLoading}
                      isVirtualized={(users?.data?.length ?? 0) > 10}
                      items={users?.data ?? []}
                      itemHeight={48}
                    >
                      {user => (
                        <SelectItem key={user.id} textValue={user.fullName}>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-small">
                                {user.fullName}
                              </span>
                              <span className="text-tiny text-default-400">
                                {user.email || user.phone}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </ControlledSelect>
                    <ControlledInput
                      name="genreIds"
                      control={form.control}
                      label="ID жанрів (через кому)"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="seriesId"
                      control={form.control}
                      label="ID серії"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="edition"
                      control={form.control}
                      label="Видання"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="format"
                      control={form.control}
                      label="Формат"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="fileUrl"
                      control={form.control}
                      label="URL файлу книги"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                      placeholder="https://"
                    />
                    <ControlledInput
                      name="asin"
                      control={form.control}
                      label="ASIN"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                    <ControlledInput
                      name="isbn"
                      control={form.control}
                      label="ISBN"
                      rules={{
                        required: "Це поле є обов'язковим",
                      }}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    color="default"
                    className="ml-2"
                    onPress={() => {
                      onClose();
                    }}
                    isDisabled={isSubmitting}
                  >
                    Скасувати
                  </Button>
                  <Button
                    color="primary"
                    className="ml-2"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Зберегти
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
}
