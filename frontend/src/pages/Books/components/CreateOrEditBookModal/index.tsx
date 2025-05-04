import { ControlledDatePicker } from '@/components/ControlledDatePicker';
import { ControlledInput } from '@/components/ControlledInput';
import { ControlledNumberInput } from '@/components/ControlledNumberInput';
import { ControlledSelect } from '@/components/ControlledSelect';
import { ControlledTextArea } from '@/components/ControlledTextArea';
import { UploadFileButton } from '@/components/UploadFileButton';
import { useGetPublishersQuery } from '@/hooks/useGetPublishersQuery';
import { useGetUsersQuery } from '@/hooks/useGetUsersQuery';
import { bookService } from '@/services/bookService';
import { priceService } from '@/services/priceService';
import { IBook, IBookCreate } from '@/types/book';
import { addErrorToast } from '@/utils/errorToast';
import { translateLocale } from '@/utils/i18n';
import { toFixed } from '@/utils/number';
import {
  addToast,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
} from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import locale from 'locale-codes';
import { ArrowUpFromLineIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { cloneElement, ReactElement, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { GenresSelect } from './GenresSelect';

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

  const form = useForm<IBookCreate>({
    values: isEditMode
      ? {
          title: book?.title,
          description: book?.description,
          publishedAt: book?.publishedAt || new Date().toISOString(),
          publishedByUserId: book?.publishedBy?.id,
          language: book?.language,
          coverUrl: book?.coverUrl,
          priceInETH: book?.priceInETH,
          publisherId: book?.publisher?.id,
          authorIds: book?.authors?.map(author => author.id) || [],
          genreIds: book?.genres.map(genre => genre.id) || [],
          seriesId: book?.seriesId,
          edition: book?.edition,
          format: book?.format,
          fileUrl: book?.fileUrl,
          asin: book?.asin,
          isbn: book?.isbn,
        }
      : undefined,
  });

  const ethPriceInUSD = useMemo(() => priceService.get('eth'), []);
  const price = useWatch({
    control: form.control,
    name: 'priceInETH',
  });

  const handleSubmit = async (formData: IBookCreate) => {
    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await bookService.updateBookById(book?.id, formData);
      } else {
        await bookService.createBook(formData);
      }

      handleOpenChange(false);
      onSuccess?.();
      addToast({
        title: isEditMode ? 'Книгу успішно оновлено' : 'Книгу успішно додано',
        severity: 'success',
      });
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
          <FormProvider {...form}>
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
                      <ControlledSelect
                        name="language"
                        control={form.control}
                        label="Мова книги"
                        description="Код мови згідно стандарту ISO 639-1"
                        isVirtualized
                        itemHeight={48}
                        items={locale.all.filter(l => l.tag.length === 2)}
                        rules={{
                          required: "Це поле є обов'язковим",
                        }}
                      >
                        {language => (
                          <SelectItem
                            key={language.tag}
                            textValue={translateLocale(
                              language.tag,
                              `${language.name} ${language.location}`
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-small capitalize">
                                  {translateLocale(
                                    language.tag,
                                    `${language.name} ${language.location}`
                                  )}
                                </span>
                                <span className="text-tiny text-default-400">
                                  {language.tag}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </ControlledSelect>
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
                            inputProps={{
                              accept: 'image/png,image/jpeg,image/webp',
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
                              (~${toFixed(+(price || 0) * ethPriceInUSD.usd, 2)}
                              )
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
                        endContent={
                          <Button isIconOnly size="sm" variant="flat">
                            <PlusIcon width={16} height={16} />
                          </Button>
                        }
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
                      <GenresSelect />
                      <ControlledInput
                        name="seriesId"
                        control={form.control}
                        label="ID серії"
                      />
                      <ControlledInput
                        name="edition"
                        control={form.control}
                        label="Видання"
                      />
                      <ControlledInput
                        name="format"
                        control={form.control}
                        label="Формат"
                      />
                      <ControlledInput
                        name="fileUrl"
                        control={form.control}
                        label="URL файлу книги"
                        rules={{
                          required: "Це поле є обов'язковим",
                        }}
                        placeholder="https://"
                        endContent={
                          <UploadFileButton
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onSuccess={files => {
                              form.setValue('fileUrl', files[0].url);
                            }}
                            inputProps={{
                              accept:
                                'text/*,application/pdf,application/rtf,application/epub+zip',
                            }}
                          >
                            <ArrowUpFromLineIcon width={16} height={16} />
                          </UploadFileButton>
                        }
                      />
                      <ControlledInput
                        name="asin"
                        control={form.control}
                        label="ASIN"
                      />
                      <ControlledInput
                        name="isbn"
                        control={form.control}
                        label="ISBN"
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
          </FormProvider>
        </Form>
      </Modal>
    </>
  );
}
