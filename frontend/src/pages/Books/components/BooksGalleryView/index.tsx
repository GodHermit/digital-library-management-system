import { BookGalleryItem } from '@/components/BookGalleryItem';
import { SearchModal } from '@/components/SearchModal';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import { Input, Pagination } from '@heroui/react';
import { useState } from 'react';

export function BooksGalleryView() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBooksQuery({
    page,
    limit: 5,
    sortBy: ['createdAt:DESC'],
  });

  return (
    <>
      <div className="mb-4">
        <Input
          readOnly
          placeholder="Уведіть запит, щоб знайти книгу"
          onClick={() => setIsSearchModalOpen(true)}
        />

        <SearchModal
          isOpen={isSearchModalOpen}
          onOpenChange={setIsSearchModalOpen}
        />
      </div>
      <section className="flex flex-wrap justify-start gap-x-4 gap-y-12">
        {isLoading &&
          Array.from({ length: 25 }).map((_, index) => (
            <BookGalleryItem key={index} isLoading />
          ))}
        {data?.data.map((book, index) => (
          <BookGalleryItem key={index} book={book} isLoading={isLoading} />
        ))}
      </section>
      {!!data && data?.meta.totalPages > 1 && (
        <div className="mt-8 flex w-full justify-center not-prose">
          <Pagination
            page={page}
            total={data?.meta.totalPages || 1}
            isCompact
            onChange={setPage}
          />
        </div>
      )}
    </>
  );
}
