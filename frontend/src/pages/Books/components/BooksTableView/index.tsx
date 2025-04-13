import { WidgetCard } from '@/components/Widget';
import { useGetBooksQuery } from '@/hooks/useGetBooksQuery';
import { IBook } from '@/types/book';
import { ITableRows } from '@/types/table';
import {
  Button,
  getKeyValue,
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
    render: item => item.isbn || <div className="text-zinc-500">–</div>,
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
  const { data, isLoading, mutate } = useGetBooksQuery({
    page,
    limit: 25,
    sortBy: ['createdAt:DESC'],
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
      <Table
        removeWrapper
        className="not-prose"
        aria-label="Таблиця користувачів"
        bottomContent={
          totalPages > 0 ? (
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
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
                <TableCell key={`${item?.id}-${columnKey}`}>
                  <div className="flex items-center gap-2">
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
                        >
                          <EyeIcon width={16} height={16} />
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
    </>
  );
}
