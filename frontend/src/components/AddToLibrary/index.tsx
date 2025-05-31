import { EStatus, IBook } from '@/types/book';
import { statusToIcons, statusToText } from '@/utils/book';
import { addErrorToast } from '@/utils/errorToast';
import {
  addToast,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { usePrivy } from '@privy-io/react-auth';
import { ChevronDownIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface AddToLibraryProps {
  book: IBook;
}

export function AddToLibrary({ book }: AddToLibraryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { authenticated: isAuthenticated, ready: isReady, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const isLoginDisabled = !isReady || (isReady && isAuthenticated);

  if (!isLoginDisabled) {
    return (
      <Button color="primary" onPress={() => login()} radius="sm">
        Увійти
      </Button>
    );
  }

  const handleAddToList = async (status: EStatus) => {
    setIsLoading(true);
    try {
      // await listsService.addBook(book.id, status, undefined, undefined);
      addToast({
        title: `Книга ${book.title} додана до списку "${statusToText[status]}"`,
        severity: 'success',
      });
      await mutate(`/api/books/${book.id}`);
    } catch (error) {
      console.log(error);
      addErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = async () => {
    if (!book.status) {
      return;
    }

    setIsLoading(true);
    try {
      // await listsService.removeBook(book.id);
      addToast({
        title: `Книга ${book.title} видалена зі списку "${statusToText[book.status]}"`,
        severity: 'success',
      });
      await mutate(`/api/books/${book.id}`);
    } catch (error) {
      console.log(error);
      addErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ButtonGroup variant="flat" className="w-full justify-normal">
      {!book.status && (
        <Button
          isLoading={isLoading}
          variant="flat"
          radius="sm"
          onPress={() => handleAddToList(EStatus.Planning)}
        >
          <Plus />
          Додати в бібліотеку
        </Button>
      )}
      {book.status && (
        <Button
          isLoading={isLoading}
          variant="flat"
          radius="sm"
          className="grow"
          onPress={() => handleRemoveFromList()}
        >
          {statusToText[book.status]}
        </Button>
      )}

      <Dropdown placement="bottom-end" className="w-60">
        <DropdownTrigger>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {Object.values(EStatus).map(status => (
            <DropdownItem
              key={status}
              onPress={() => handleAddToList(status)}
              aria-label={statusToText[status]}
            >
              <span className="flex items-center gap-2">
                {statusToIcons[status]}
                {statusToText[status]}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
