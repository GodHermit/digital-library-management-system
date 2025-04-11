import { BookGalleryItem } from '@/components/BookGalleryItem';
import { SearchModal } from '@/components/SearchModal';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import { useUserStore } from '@/stores/user';
import { EUserRole } from '@/types/user';
import { Input, Pagination } from '@heroui/react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useShallow } from 'zustand/shallow';

export function BooksPage() {
  const user = useUserStore(useShallow(s => s.user));
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBooksQuery({
    page,
    limit: 5,
    sortBy: ['createdAt:DESC'],
  });

  return (
    <>
      <Helmet>
        {user?.role === EUserRole.USER && <title>Каталог</title>}
        {user?.role === EUserRole.ADMIN && <title>Інвентар</title>}
      </Helmet>
      {user?.role === EUserRole.USER && <h1>Каталог</h1>}
      {user?.role === EUserRole.ADMIN && <h1>Інвентар</h1>}

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
        <div className="mt-8 flex w-full justify-center">
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
