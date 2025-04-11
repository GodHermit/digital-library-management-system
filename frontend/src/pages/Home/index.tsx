import { BookGalleryItem } from '@/components/BookGalleryItem';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import mainAdVideo from '@/assets/main_ad.mp4';

export function HomePage() {
  const { data, isLoading } = useGetBooksQuery({
    page: 1,
    limit: 10,
    sortBy: ['createdAt:DESC'],
  });

  return (
    <>
      <h1>Головна</h1>
      <div className="flex justify-center">
        <video
          src={mainAdVideo}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          className="m-0 w-2/3"
        />
      </div>
      <h2>Нещодавно додані</h2>
      <section className="flex flex-wrap justify-start gap-x-4 gap-y-12">
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
