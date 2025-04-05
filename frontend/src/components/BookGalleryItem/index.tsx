import { IBook } from '@/types/book';
import { ROUTES } from '@/types/routes';
import { Button, Image, Skeleton } from '@heroui/react';
import clsx from 'clsx';
import { PlusIcon } from 'lucide-react';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface IBookGaleryItemProps {
  book?: IBook;
  isLoading?: boolean;
}

export function BookGalleryItem({ book, isLoading }: IBookGaleryItemProps) {
  const handleAddToList = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      to={book ? ROUTES.BOOK.replace(':id', book?.id.toString()) : '#'}
      className={clsx(
        'group relative flex max-w-[11.5625rem] flex-col gap-2 no-underline',
        isLoading && 'pointer-events-none'
      )}
    >
      <Skeleton isLoaded={!isLoading} className="rounded-large">
        <div className="relative flex">
          <Image
            src={book?.coverUrl}
            alt=""
            className="!m-0 block h-[16.5625rem] w-[11.5625rem] min-w-[11.5625rem] object-cover brightness-90"
            isBlurred
            isZoomed
            isLoading={isLoading}
          />
          <div className="absolute bottom-2 right-2 z-10 flex transition-opacity duration-300 group-[:hover]:opacity-100 md:opacity-0">
            <Button
              variant="shadow"
              size="sm"
              isIconOnly
              onClick={handleAddToList}
            >
              <PlusIcon width={16} height={16} />
            </Button>
          </div>
        </div>
      </Skeleton>
      <div className="flex items-baseline gap-2">
        {!isLoading && (
          <div className="size-2.5 min-w-2.5 rounded-full bg-blue-500" />
        )}
        <Skeleton
          isLoaded={!isLoading}
          className="relative z-10 line-clamp-2 rounded-large text-sm font-normal text-foreground-800"
        >
          {isLoading ? 'Loading this title...' : book?.title}
        </Skeleton>
      </div>
    </Link>
  );
}
