import { priceService } from '@/services/priceService';
import { useShoppingCartStore } from '@/stores/soppingCart';
import { IBook } from '@/types/book';
import { ROUTES } from '@/types/routes';
import { toFixed } from '@/utils/number';
import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { TrashIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

export const columns = [
  { name: 'Товар', uid: 'item' },
  { name: 'Ціна', uid: 'price' },
  { name: 'Дії', uid: 'actions' },
];

export function ShoppingCart() {
  const [items, totalPrice, removeItem] = useShoppingCartStore(
    useShallow(s => [s.items, s.totalPrice(), s.removeItem])
  );
  const navigate = useNavigate();

  const ethPrice = useMemo(() => priceService.get('eth'), []);

  const handleRemoveItem = useCallback(
    (item: IBook) => {
      removeItem(item);
    },
    [removeItem]
  );

  const renderCell = useCallback((book: IBook, columnKey: string | number) => {
    switch (columnKey) {
      case 'item':
        return (
          <Link
            to={ROUTES.BOOK.replace(':id', book.id)}
            className="flex items-start gap-2"
          >
            <Image src={book?.coverUrl} className="m-0 max-w-11" radius="sm" />
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold">{book.title}</h3>
              <div className="line-clamp-2 max-w-60">{book.description}</div>
            </div>
          </Link>
        );
      case 'price':
        return (
          <div className="flex items-center gap-1 text-base">
            <span>{book.priceInETH} ETH</span>
            <span className="text-zinc-500">
              (~{toFixed(book.priceInETH * ethPrice.usd, 2)}$)
            </span>
          </div>
        );
      case 'actions':
        return (
          <Tooltip content="Видалити з кошика">
            <Button
              variant="flat"
              color="danger"
              size="sm"
              isIconOnly
              onPress={() => {
                handleRemoveItem(book);
              }}
            >
              <TrashIcon width={20} height={20} />
            </Button>
          </Tooltip>
        );
    }
  }, []);

  return (
    <>
      <h1>Кошик</h1>
      <Table removeWrapper className="not-prose" aria-label="Таблиця товарів">
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Кошик порожній">
          {item => (
            <TableRow key={item.id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-col items-end gap-4">
        <div className="flex items-center gap-1 text-base">
          <span className="text-white">Всього до сплати:</span>
          <span>{totalPrice} ETH</span>
          <span className="text-zinc-500">
            (~{toFixed(totalPrice * ethPrice.usd, 2)}$)
          </span>
        </div>
        {items.length <= 0 && (
          <div className="text-sm text-zinc-500">
            Додайте товари до кошика, щоб продовжити
          </div>
        )}
        {items.length > 0 && (
          <Button
            size="lg"
            color="primary"
            onPress={() => navigate(ROUTES.CHECKOUT)}
          >
            Оформити замовлення
          </Button>
        )}
      </div>
    </>
  );
}
