import { BookGalleryItem } from '@/components/BookGalleryItem';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';

export function HomePage() {
  const { data, isLoading } = useGetBooksQuery({
    page: 1,
    limit: 10,
  });

  return (
    <>
      <h1>Головна</h1>
      <section className="flex flex-wrap justify-between gap-x-4 gap-y-12">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <BookGalleryItem key={index} isLoading />
          ))}
        {data?.data.map((book, index) => (
          <BookGalleryItem key={index} book={book} isLoading={isLoading} />
        ))}
      </section>
    </>
  );
}
