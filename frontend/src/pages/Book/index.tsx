// import { AddToLibrary } from '@/components/AddToLibrary';
// import { AddToLibrary } from '@/components/AddToLibrary';
import { useGetBookQuery } from '@/hooks/useGetBookQuery';
import { useShoppingCartStore } from '@/stores/soppingCart';
import { Button, Chip, Image } from '@heroui/react';
import dayjs from 'dayjs';
import uk from 'dayjs/locale/uk';
import { CheckIcon, ShoppingCartIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { data, Link, useParams } from 'react-router';
import { useShallow } from 'zustand/shallow';
import { CreateOrEditBookModal } from '../Books/components/CreateOrEditBookModal';
import { useUserStore } from '@/stores/user';
import { EUserRole } from '@/types/user';
dayjs.locale(uk);

export function Book() {
  const { id } = useParams();
  const { data: book, isLoading, mutate } = useGetBookQuery(id);
  const [isInCart, addItem] = useShoppingCartStore(
    useShallow(s => [s.isInCart(book), s.addItem])
  );

  const user = useUserStore(s => s.user);

  if (!book && !isLoading) {
    throw data('Book not found', { status: 404 });
  }

  return (
    <>
      <Helmet>
        <title>{book?.title}</title>
      </Helmet>
      <div className="flex gap-10">
        <div className="flex max-w-60 flex-col gap-2">
          <Image src={book?.coverUrl} className="m-0 max-w-60" radius="sm" />
          <Button
            radius="sm"
            startContent={
              isInCart ? (
                <CheckIcon />
              ) : (
                <ShoppingCartIcon width={16} height={16} />
              )
            }
            isDisabled={isInCart}
            variant={isInCart ? 'flat' : 'solid'}
            color={isInCart ? 'success' : 'primary'}
            onPress={() => {
              if (book) {
                addItem(book);
              }
            }}
          >
            {isInCart ? (
              'Додано в кошик'
            ) : (
              <>Купити за {book?.priceInETH} ETH</>
            )}
          </Button>
          {/* {book && user && <AddToLibrary book={book} />} */}
          {book && user && user.role === EUserRole.ADMIN && (
            <CreateOrEditBookModal book={book} onSuccess={() => mutate()}>
              <Button
                size="sm"
                radius="sm"
                variant="light"
                className="justify-start text-left text-zinc-500 hover:text-zinc-100"
              >
                Запропонувати зміни
              </Button>
            </CreateOrEditBookModal>
          )}
          {book && (!user || (user && user.role === EUserRole.USER)) && (
            <Button
              as={Link}
              to={'https://tally.so/r/wagPLZ'}
              target="_blank"
              size="sm"
              radius="sm"
              variant="light"
              className="justify-start text-left text-zinc-500 hover:text-zinc-100"
            >
              Запропонувати зміни
            </Button>
          )}
        </div>
        <div>
          <h1 className="mb-2">{book?.title}</h1>
          <div className="m-0 flex flex-wrap gap-2 text-xl text-foreground">
            {book?.authors?.map(a => (
              <Chip key={a.id} variant="bordered">
                {a.fullName}
              </Chip>
            ))}
          </div>
          <p>{book?.description}</p>
          {book?.genres && book.genres.length > 0 && (
            <p className="text-sm">
              <span className="font-bold text-foreground">Жанри:</span>{' '}
              {book.genres.map(g => g.name).join(', ')}
            </p>
          )}
          <p className="text-sm">
            <span className="font-bold text-foreground">Опубліковано: </span>
            {dayjs(book?.publishedAt).format('DD MMMM YYYY')}
            {book?.publisher && (
              <>
                ,{' '}
                {book.publisher.website ? (
                  <a
                    href={book.publisher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline hover:text-blue-600"
                  >
                    {book.publisher.name}
                  </a>
                ) : (
                  book.publisher.name
                )}
              </>
            )}
          </p>
          {book?.language && (
            <p className="text-sm">
              <span className="font-bold text-foreground">Мова: </span>
              {new Intl.DisplayNames(['uk'], { type: 'language' }).of(
                book?.language
              )}
            </p>
          )}
          {book?.asin && (
            <p className="text-sm">
              <span className="font-bold text-foreground">ASIN: </span>
              {book?.asin}
            </p>
          )}
          {book?.isbn && (
            <p className="text-sm">
              <span className="font-bold text-foreground">ISBN: </span>
              {book?.isbn}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
