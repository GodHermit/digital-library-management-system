import { bookService } from '@/services/bookService';
import { IBook } from '@/types/book';
import { addErrorToast } from '@/utils/errorToast';
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { TrashIcon } from 'lucide-react';
import { cloneElement, ReactElement, useState } from 'react';

interface IDeleteBookModalProps {
  book: IBook;
  children?: ReactElement;
  onSuccess?: () => void;
}

export function DeleteBookModal({ book, children, onSuccess }: IDeleteBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      await bookService.deleteBookById(book.id);

      setIsOpen(false);
      addToast({
        title: 'Книгу видалено',
        description: `Книгу "${book.title}" було успішно видалено.`,
        severity: 'success',
      });
      onSuccess?.();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsSubmitting(false);
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
        onOpenChange={setIsOpen}
        backdrop="blur"
        closeButton={false}
        hideCloseButton
        isDismissable={!isSubmitting}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex gap-1 px-4">
                <TrashIcon />
                Впевнені, що хочете видалити книгу?
              </ModalHeader>
              <ModalBody className="max-h-[calc(100vh-200px)] overflow-y-auto px-4 pb-4 pt-0">
                <div className="flex flex-col gap-2 text-sm text-zinc-500">
                  <div>
                    <strong>Назва:</strong> {book.title}
                  </div>
                  <div className="text-sm font-medium">
                    Ця дія незворотна. Книгу буде повністю видалено.
                  </div>
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
                  color="danger"
                  className="ml-2"
                  onPress={() => {
                    handleDelete();
                  }}
                  isLoading={isSubmitting}
                >
                  Видалити
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
