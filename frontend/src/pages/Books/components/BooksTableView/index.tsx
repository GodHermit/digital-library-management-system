import { WidgetCard } from '@/components/Widget';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import { IBook } from '@/types/book';
import { ITableRows } from '@/types/table';
import {
  Button,
  getKeyValue,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import dayjs from 'dayjs';
import { BookIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { DeleteBookModal } from '../DeleteBookModal';
import { Link } from 'react-router';
import { ROUTES } from '@/types/routes';
import { CreateOrEditBookModal } from '../CreateOrEditBookModal';
import clsx from 'clsx';
import { useDebounceValue } from 'usehooks-ts';

const columns: ITableRows<IBook> = [
  {
    key: 'id',
    label: 'Ідентифікатор',
  },
  {
    key: 'title',
    label: 'Назва',
  },
  {
    key: 'authors',
    label: 'Автори',
    render: item =>
      item.authors?.map(author => author.fullName).join(', ') || (
        <div className="text-zinc-500">–</div>
      ),
  },
  {
    key: 'createdAt',
    label: 'Дата створення',
    render: item => dayjs(item.createdAt).format('DD.MM.YYYY HH:mm'),
  },
  {
    key: 'publishedAt',
    label: 'Дата публікації',
    render: item => dayjs(item.publishedAt).format('DD.MM.YYYY HH:mm'),
  },
  {
    key: 'priceInETH',
    label: 'Ціна в ETH',
    render: item => item.priceInETH,
  },
  {
    key: 'asin',
    label: 'ASIN',
    render: item => item.asin || <div className="text-zinc-500">–</div>,
  },
  {
    key: 'isbn',
    label: 'ISBN',
    render: item => item.isbn || <div className="text-zinc-500">–</div>,
  },
  {
    key: 'publisher',
    label: 'Видавництво',
    render: item =>
      item.publisher?.name || <div className="text-zinc-500">–</div>,
  },
  {
    key: 'genres',
    label: 'Жанри',
    render: item =>
      item.genres?.map(genre => genre.name).join(', ') || (
        <div className="text-zinc-500">–</div>
      ),
  },
  {
    key: 'actions',
    label: 'Дії',
    render: () => <></>,
  },
];

export function BooksTableView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounceValue(search, 500);
  const { data, isLoading, mutate } = useGetBooksQuery({
    page,
    limit: 25,
    sortBy: ['createdAt:DESC'],
    search: searchDebounce,
  });

  const totalPages = data?.meta.totalPages ?? 0;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <WidgetCard
          label="Кількість книг"
          value={data?.meta.totalItems ?? 0}
          valueIcon={<BookIcon width={24} height={24} />}
          isLoading={isLoading}
        />
      </div>
      <div className="mb-4 flex justify-end gap-2">
        <Input
          placeholder="Пошук..."
          size="sm"
          variant="bordered"
          className="max-w-[200px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <CreateOrEditBookModal onSuccess={mutate}>
          <Button color="primary" size="sm">
            Додати книгу
          </Button>
        </CreateOrEditBookModal>
      </div>
      <Table
        removeWrapper
        isHeaderSticky
        isCompact
        className="not-prose"
        classNames={{
          base: 'overflow-auto',
        }}
        aria-label="Таблиця користувачів"
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              width={500}
              key={column.key}
              className={clsx(
                column.key === 'actions' && 'sticky right-0 z-10 bg-default-100'
              )}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data?.data ?? []}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {item => (
            <TableRow key={item?.id}>
              {columnKey => (
                <TableCell
                  key={`${item?.id}-${columnKey}`}
                  className={clsx(
                    columnKey === 'actions' &&
                      'sticky right-0 z-10 bg-default-50'
                  )}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {columnKey !== 'actions' &&
                      (columns.find(c => c.key === columnKey)?.render?.(item) ||
                        getKeyValue(item, columnKey))}
                    {columnKey === 'actions' && (
                      <>
                        <Button
                          isIconOnly
                          size="sm"
                          as={Link}
                          to={ROUTES.BOOK.replace(':id', item.id)}
                          target="_blank"
                        >
                          <EyeIcon width={16} height={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          as={Link}
                          to={item.fileUrl}
                          target="_blank"
                        >
                          <BookIcon width={16} height={16} />
                        </Button>
                        <CreateOrEditBookModal book={item} onSuccess={mutate}>
                          <Button isIconOnly size="sm">
                            <PencilIcon width={16} height={16} />
                          </Button>
                        </CreateOrEditBookModal>
                        <DeleteBookModal book={item} onSuccess={mutate}>
                          <Button isIconOnly size="sm" color="danger">
                            <TrashIcon width={16} height={16} />
                          </Button>
                        </DeleteBookModal>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 0 && (
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={page => setPage(page)}
          />
        </div>
      )}
    </>
  );
}
