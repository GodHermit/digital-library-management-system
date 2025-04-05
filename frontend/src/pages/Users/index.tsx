import { WidgetCard } from '@/components/Widget';
import { userService } from '@/services/userService';
import { ITableRows } from '@/types/table';
import { IUser } from '@/types/user';
import {
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
import { UsersIcon } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

const columns: ITableRows<IUser> = [
  {
    key: 'id',
    label: 'Ідентифікатор',
  },
  {
    key: 'fullName',
    label: 'Імʼя',
  },
  {
    key: 'email',
    label: 'Електронна пошта',
  },
  {
    key: 'role',
    label: 'Роль',
  },
  {
    key: 'createdAt',
    label: 'Дата реєстрації',
    render: item => dayjs(item.createdAt).format('DD.MM.YYYY HH:mm'),
  },
];

export function UsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `/users?page=${page}`,
    async () => userService.getUsers(page),
    {
      keepPreviousData: true,
    }
  );

  const pages = data?.meta.totalPages ?? 0;

  return (
    <>
      <h1>Користувачі</h1>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <WidgetCard
          label="Кількість користувачів"
          value={data?.meta.totalItems}
          valueIcon={<UsersIcon width={24} height={24} />}
        />
      </div>
      <Table
        removeWrapper
        className="not-prose"
        aria-label="Таблиця користувачів"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
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
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {item => (
            <TableRow key={item?.id}>
              {columnKey => (
                <TableCell>
                  {columnKey !== 'actions' &&
                  columns.find(c => c.key === columnKey)?.render
                    ? columns
                        .find(c => c.key === columnKey)
                        ?.render?.(getKeyValue(item, columnKey))
                    : getKeyValue(item, columnKey)}
                  {columnKey === 'actions' && <></>}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
