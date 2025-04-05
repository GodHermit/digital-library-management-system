import { useShortcut } from '@/hooks/useShortcut';
import {
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FrownIcon, SearchIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SearchModal({ isOpen, onOpenChange }: ShareModalProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredArticles = useMemo(() => {
    // Search by name and content
    return [];
    // return articles.filter(
    //   (el) =>
    //     el.metadata.name.toLowerCase().includes(search.toLowerCase()) ||
    //     el.contentMarkdown.toLowerCase().includes(search.toLowerCase())
    // );
  }, [search]);

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
        {(onClose) => (
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
                onChange={(e) => setSearch(e.target.value)}
                ref={inputRef}
              />
            </ModalHeader>
            <ModalBody className="px-4 pb-4 pt-0">
              {filteredArticles.length === 0 && (
                <>
                  <div className="flex items-center justify-center gap-2 text-default-500">
                    No results found <FrownIcon />
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter className="justify-start gap-4 px-4 pt-0">
              <div className="flex items-center gap-1 text-sm text-default-400">
                <Kbd className="text-default-400" keys={['enter']}></Kbd>
                to select
              </div>
              <div className="flex items-center gap-1 text-sm text-default-400">
                <Kbd className="text-default-400" keys={['down']}></Kbd>
                <Kbd className="text-default-400" keys={['up']}></Kbd>
                to navigate
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
