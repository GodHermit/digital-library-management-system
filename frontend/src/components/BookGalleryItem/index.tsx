import { ROUTES } from '@/types/routes';
import { Button, Image } from "@heroui/react";
import { PlusIcon } from 'lucide-react';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

export function BookGalleryItem() {
  const handleAddToList = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      to={ROUTES.BOOK}
      className="group relative flex max-w-[11.5625rem] flex-col gap-2 no-underline"
    >
      <div className="relative flex">
        <Image
          src={
            'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx132029-jIm1KsPcIwIl.jpg'
          }
          alt=""
          className="!m-0 block h-[16.5625rem] w-[11.5625rem] min-w-[11.5625rem] object-cover brightness-90"
          isBlurred
          isZoomed
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
      <div className="flex items-baseline gap-2">
        <div className="size-2.5 min-w-2.5 rounded-full bg-blue-500" />
        <div className="relative z-10 line-clamp-2 text-sm font-normal text-foreground-800">
          Dandadan
        </div>
      </div>
    </Link>
  );
}
