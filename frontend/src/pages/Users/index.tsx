import { WidgetCard } from '@/components/Widget';
import { TABLE_ROWS_PER_PAGE } from '@/constants';
import { SECOND } from '@/constants/time';
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
  Tooltip,
} from "@heroui/react";
import { EyeIcon, PencilIcon, UserPenIcon, UsersIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
];

const columns = [
  {
    key: 'name',
    label: 'Імʼя',
  },
  {
    key: 'role',
    label: 'Роль',
  },
  {
    key: 'actions',
    label: 'Дії',
  },
];

export function UsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `/users?page=${page}`,
    async () => {
      await new Promise((resolve) => setTimeout(resolve, SECOND));
      return rows;
    },
    {
      keepPreviousData: true,
    }
  );

  const pages = useMemo(() => {
    return Math.ceil(rows.length / TABLE_ROWS_PER_PAGE);
  }, []);

  return (
    <>
      <h1>Користувачі</h1>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <WidgetCard
          label="Кількість користувачів"
          value={rows.length}
          valueIcon={<UsersIcon width={24} height={24} />}
        />
        <WidgetCard
          label="Кількість авторів"
          value={0}
          valueIcon={<UserPenIcon width={24} height={24} />}
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
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data ?? []}
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {(item) => (
            <TableRow key={item?.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey !== 'actions' && getKeyValue(item, columnKey)}
                  {columnKey === 'actions' && (
                    <>
                      <Tooltip content="Переглянути" placement="bottom">
                        <Button variant="light" isIconOnly size="sm">
                          <EyeIcon width={16} height={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Редагувати" placement="bottom">
                        <Button variant="light" isIconOnly size="sm">
                          <PencilIcon width={16} height={16} />
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
