import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import { useShortcut } from '@/hooks/useShortcut';
import { ROUTES } from '@/types/routes';
import {
  Card,
  CardBody,
  Image,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@heroui/react';
import { FrownIcon, SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SearchModal({ isOpen, onOpenChange }: ShareModalProps) {
  const [search, setSearch] = useState('');
  const [searchDebounced] = useDebounceValue(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useGetBooksQuery({
    page: 1,
    limit: 10,
    search: searchDebounced,
  });

  useShortcut(
    () => {
      onOpenChange(true);
    },
    ['k'],
    {
      metaKey: true,
    }
  );

  useShortcut(
    () => {
      onOpenChange(true);
    },
    ['down'],
    {
      ref: inputRef,
    }
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      closeButton={false}
      hideCloseButton
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-4">
              <Input
                autoFocus
                variant="bordered"
                type="text"
                placeholder="Search..."
                size="lg"
                radius="sm"
                startContent={<SearchIcon className="text-default-300" />}
                endContent={
                  <Kbd className="cursor-pointer" onClick={onClose}>
                    Esc
                  </Kbd>
                }
                value={search}
                onChange={e => setSearch(e.target.value)}
                ref={inputRef}
              />
            </ModalHeader>
            <ModalBody className="px-4 pb-4 pt-0">
              {isLoading && (
                <div className="flex min-h-10 items-center justify-center gap-2 text-default-500">
                  <Spinner />
                </div>
              )}
              {data?.data.length === 0 && (
                <>
                  <div className="flex min-h-10 items-center justify-center gap-2 text-default-500">
                    No results found <FrownIcon />
                  </div>
                </>
              )}
              {data?.data.map(book => (
                <Card
                  key={book.id}
                  isPressable
                  isHoverable
                  onPress={() => {
                    onClose();
                    navigate(ROUTES.BOOK.replace(':id', book.id));
                  }}
                >
                  <CardBody>
                    <div className="flex gap-4">
                      <Image
                        width={64}
                        height={100}
                        src={book.coverUrl}
                        className="min-w-16 object-cover"
                        radius="sm"
                        alt=""
                      />
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">{book.title}</div>
                        <div className="text-sm text-default-400">
                          {/* Show min and max 100 chars */}
                          {(() => {
                            const text = book.description;
                            const searchTerm = searchDebounced.toLowerCase();

                            if (!searchTerm) {
                              return text.slice(0, 100);
                            }

                            const matchIndex = text
                              .toLowerCase()
                              .indexOf(searchTerm);
                            if (matchIndex === -1) {
                              return text.slice(0, 100);
                            }

                            // Center the slice around the match
                            const start = Math.max(0, matchIndex - 40);
                            const end = Math.min(text.length, start + 100);

                            return text
                              .slice(start, end)
                              .split(new RegExp(`(${searchDebounced})`, 'gi'))
                              .map((part, i) =>
                                part.toLowerCase() === searchTerm ? (
                                  <span
                                    key={i}
                                    className="text-black dark:text-white"
                                  >
                                    {part}
                                  </span>
                                ) : (
                                  part
                                )
                              );
                          })()}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
