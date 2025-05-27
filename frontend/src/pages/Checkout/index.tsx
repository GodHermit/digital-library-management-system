import { TARGET_CHAIN } from '@/configs/wagmi';
import { useColorMode } from '@/hooks/useColorMode';
import { useGetOrderQuery } from '@/hooks/useGetOrderQuery';
import { orderService } from '@/services/orderService';
import { priceService } from '@/services/priceService';
import { userService } from '@/services/userService';
import { useSettingsStore } from '@/stores/settings';
import { shoppingCartStore, useShoppingCartStore } from '@/stores/soppingCart';
import { useUserStore } from '@/stores/user';
import { EOrderStatus } from '@/types/order';
import { ROUTES } from '@/types/routes';
import { COLOR_MODE } from '@/types/settings';
import { addErrorToast } from '@/utils/errorToast';
import { toFixed, toFixedFloor } from '@/utils/number';
import { orderStatusToColor, orderStatusToText } from '@/utils/order';
import { fontSizeToPX } from '@/utils/settings';
import {
  Button,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useLinkAccount, useLogin, usePrivy } from '@privy-io/react-auth';
import dayjs from 'dayjs';
import { Link2Icon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { data, useNavigate, useParams } from 'react-router';
import { useTimer } from 'react-timer-hook';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useShallow } from 'zustand/shallow';
import { ICheckoutForm } from './scheme';
import { downloadByUrl } from '@/utils/download';

export function CheckoutPage() {
  const { id: orderId } = useParams();
  const { address, isConnecting, isReconnecting } = useAccount();
  const [fontSize] = useSettingsStore(useShallow(s => [s.fontSize]));
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const {
    authenticated: isAuthenticated,
    ready: isReady,
    login,
    linkWallet,
  } = usePrivy();
  const { data: balance } = useBalance({
    address: address,
  });
  const isLoginDisabled = !isReady || (isReady && isAuthenticated);
  const [user] = useUserStore(useShallow(s => [s.user]));
  const [localItems] = useShoppingCartStore(useShallow(s => [s.items]));
  const email = user?.email;

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderQuery(orderId, {
    onSuccess: data => {
      restart(dayjs(data.createdAt).add(30, 'minutes').toDate());
    },
    refreshInterval: 5000,
  });

  if (error) {
    throw data('Order not found', { status: 404 });
  }

  const { minutes, seconds, restart } = useTimer({
    autoStart: !!order,
    expiryTimestamp: dayjs(
      order?.createdAt ? new Date(order.createdAt) : new Date()
    )
      .add(30, 'minutes')
      .toDate(),
  });

  const items = useMemo(
    () => order?.items.map(i => i.book) || localItems,
    [localItems, order?.items]
  );

  const form = useForm<ICheckoutForm>({
    values: {
      fullName: user?.fullName,
      email: user?.email,
      items: items.map(item => item.id),
    },
  });

  const formattedBalance = useMemo(() => {
    if (!balance) return 0;
    return toFixedFloor(
      formatUnits(
        balance?.value || 0n,
        balance?.decimals || TARGET_CHAIN.nativeCurrency.decimals
      ),
      6
    );
  }, [balance]);

  const ethPrice = useMemo(() => priceService.get('eth'), []);

  const totalPrice = useMemo(() => {
    if (!items) return 0;
    return items.reduce((acc, item) => {
      const price = item.priceInETH || 0;
      return acc + price;
    }, 0);
  }, [items]);

  useLogin({
    onComplete: async () => {
      await userService.registerUser();
    },
  });

  useLinkAccount({
    onSuccess: async () => {
      await userService.registerUser();
    },
  });

  useEffect(() => {
    const isDarkMode = colorMode === COLOR_MODE.DARK;

    if (isDarkMode) {
      document.documentElement.classList.add(COLOR_MODE.DARK);
      document.documentElement.classList.remove(COLOR_MODE.LIGHT);
      document.body.classList.remove(COLOR_MODE.LIGHT);
      document.body.classList.add(COLOR_MODE.DARK);
    } else {
      document.documentElement.classList.add(COLOR_MODE.LIGHT);
      document.documentElement.classList.remove(COLOR_MODE.DARK);
      document.body.classList.remove(COLOR_MODE.DARK);
      document.body.classList.add(COLOR_MODE.LIGHT);
    }
  }, [colorMode]);

  useEffect(() => {
    const fontSizeInPX = fontSizeToPX(fontSize);
    document.documentElement.style.fontSize = fontSizeInPX;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  const handleCancel = async () => {
    try {
      const { clear } = shoppingCartStore.getState();
      if (!orderId) {
        navigate(ROUTES.SHOPPING_CART);
        return;
      } else {
        await orderService.closeOrder(orderId, 'cancelled');
        clear();
        navigate(ROUTES.SHOPPING_CART);
      }
    } catch (error) {
      addErrorToast(error);
    }
  };

  const handleSubmit = async (data: ICheckoutForm) => {
    try {
      const { clear } = shoppingCartStore.getState();
      const totalPrice = items.reduce((acc, item) => {
        const price = item.priceInETH || 0;
        return acc + price;
      }, 0);

      const paidPriceInETH = order?.paidPriceInETH ?? 0;

      if (paidPriceInETH >= totalPrice) {
        throw new Error('Замовлення вже оплачено');
      }

      if (order) {
        await orderService.payOrder(order.id, totalPrice - paidPriceInETH);
        clear();
      } else {
        await orderService.createOrder(data, totalPrice, navigate);
        clear();
      }
    } catch (error) {
      addErrorToast(error);
    }
  };

  const handleDownload = async () => {
    if (!order) return;
    for (let i = 0; i < order.items.length; i++) {
      try {
        const item = order.items[i];
        if (!item.fileUrl) continue;
        const extension = item.fileUrl.split('.').pop();
        const fileName = `${item.book.title ?? Date.now()}.${extension}`;
        await downloadByUrl(item.fileUrl, fileName);
      } catch (error) {
        addErrorToast(error);
      }
    }
  };

  const isOrderClosed = useMemo(() => {
    if (!order) return false;
    return (
      order.status === EOrderStatus.COMPLETED ||
      order.status === EOrderStatus.CANCELLED ||
      order.status === EOrderStatus.FAILED
    );
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-default-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-default-50">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="prose prose-neutral mx-auto my-8 flex h-max max-w-xl flex-col gap-10 rounded-2xl bg-default-100 p-8 dark:prose-invert prose-pre:bg-transparent prose-pre:p-0"
      >
        <h1 className="m-0">
          {!order && 'Оформлення замовлення'}
          {order && (
            <>
              <span className="text-zinc-500">#</span>
              {order.id}
            </>
          )}
        </h1>
        {!order && (
          <div className="flex flex-col gap-4">
            <h2 className="m-0">Особисті дані</h2>
            {address && (
              <>
                <div>
                  <b className="font-bold text-white">Підключений гаманець:</b>{' '}
                  <div>{address}</div>
                </div>
                <div>
                  <b className="font-bold text-white">Баланс:</b>{' '}
                  <div>
                    {formattedBalance} {balance?.symbol}{' '}
                    <span className="text-zinc-500">
                      (~${toFixedFloor(formattedBalance * ethPrice.usd, 2)})
                    </span>
                  </div>
                </div>
              </>
            )}
            {!address && (
              <Button
                variant="flat"
                color="primary"
                startContent={<Link2Icon width={16} height={16} />}
                onPress={() => linkWallet()}
                isLoading={isConnecting || isReconnecting}
                type="button"
              >
                Підключити гаманець
              </Button>
            )}
            {isReady && isAuthenticated && user && (
              <div className="flex flex-col gap-2">
                <b className="font-bold text-white">Повне ім'я:</b>{' '}
                <Controller
                  control={form.control}
                  name="fullName"
                  rules={{
                    required: "Це поле є обов'язковим",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      labelPlacement="outside"
                      type="text"
                      variant="bordered"
                      placeholder=" "
                      isRequired
                      isDisabled={form.formState.isSubmitting}
                      description="Як ми можемо звертатися до Вас?"
                      autoComplete="name"
                      defaultValue={user?.fullName}
                      validationBehavior="aria"
                      errorMessage={error?.message}
                      isInvalid={invalid}
                      {...field}
                    />
                  )}
                />
              </div>
            )}
            {isReady && isAuthenticated && user && (
              <div className="flex flex-col gap-2">
                <b className="font-bold text-white">Електронна пошта:</b>{' '}
                <Controller
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Це поле є обов'язковим",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Введіть дійсну електронну адресу',
                    },
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      labelPlacement="outside"
                      type="email"
                      variant="bordered"
                      placeholder=" "
                      isRequired={!email}
                      isDisabled={!!email || form.formState.isSubmitting}
                      readOnly={!!email}
                      defaultValue={email}
                      description="Ваша електронна адреса для зв'язку"
                      autoComplete="email"
                      validationBehavior="aria"
                      errorMessage={error?.message}
                      isInvalid={invalid}
                      {...field}
                    />
                  )}
                />
              </div>
            )}
          </div>
        )}
        {order && (
          <div className="flex flex-col gap-4">
            {order.status === EOrderStatus.PENDING && (
              <div>
                <b className="font-bold text-white">Час для оплати:</b>{' '}
                <span>
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <div>
              <b className="font-bold text-white">Статус:</b>{' '}
              <Chip
                size="sm"
                variant="flat"
                color={orderStatusToColor[order?.status]}
              >
                {orderStatusToText[order?.status]}
              </Chip>
            </div>
            <div>
              <b className="font-bold text-white">Сума:</b>{' '}
              {order.paidPriceInETH} ETH із {totalPrice} ETH
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="m-0">Товари</h2>
          <Table className="not-prose" aria-label="Таблиця товарів">
            <TableHeader>
              <TableColumn>Товар</TableColumn>
              <TableColumn>Ціна</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell width="60%">
                    <div className="max-w-60 truncate">{item.title}</div>
                  </TableCell>
                  <TableCell>{item.priceInETH} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!order && (
          <div className="flex flex-col gap-2">
            <h2 className="m-0">Оплата</h2>
            <div>
              <b className="font-bold text-white">Всього до сплати:</b>{' '}
              <span>{totalPrice} ETH</span>{' '}
              <span className="text-zinc-500">
                (~${toFixed(totalPrice * ethPrice.usd, 2)})
              </span>
            </div>
            <div>
              <b className="font-bold text-white">Мережа оплати:</b>{' '}
              <span>{TARGET_CHAIN.name}</span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {order?.status === EOrderStatus.COMPLETED && (
            <>
              <div className="text-center text-green-500">
                Замовлення успішно завершене. Дякуємо за покупку!
              </div>
              <Button
                size="lg"
                className="w-full"
                color={
                  orderStatusToColor[order?.status || EOrderStatus.PENDING]
                }
                variant="solid"
                onPress={handleDownload}
                type="button"
              >
                Завантажити файли
              </Button>
            </>
          )}
          {isReady && !isAuthenticated && (
            <Button
              size="lg"
              className="w-full"
              color="primary"
              variant="solid"
              isDisabled={!isReady || isLoginDisabled}
              isLoading={!isReady}
              onPress={() => login()}
              type="button"
            >
              Увійти
            </Button>
          )}
          {isAuthenticated && order?.status !== EOrderStatus.COMPLETED && (
            <Button
              size="lg"
              className="w-full"
              color={orderStatusToColor[order?.status || EOrderStatus.PENDING]}
              variant="solid"
              isDisabled={
                !address ||
                !isAuthenticated ||
                !isReady ||
                (order && order?.status !== EOrderStatus.PENDING)
              }
              isLoading={!isReady || form.formState.isSubmitting}
              type="submit"
            >
              {!order && 'Розмістити замовлення'}
              {order?.status === EOrderStatus.PENDING && 'Оплатити замовлення'}
              {order?.status === EOrderStatus.PAID &&
                'Замовлення успішно оплачене'}
              {order?.status === EOrderStatus.CANCELLED &&
                'Замовлення скасоване'}
              {order?.status === EOrderStatus.FAILED &&
                'Виникла помилка при обробці замовлення'}
            </Button>
          )}
          {!isOrderClosed && (
            <Button
              size="lg"
              className="w-full"
              variant="flat"
              onPress={handleCancel}
              type="button"
              isDisabled={
                form.formState.isSubmitting ||
                (order && order?.status !== EOrderStatus.PENDING)
              }
            >
              Скасувати
            </Button>
          )}
          {isOrderClosed && (
            <Button
              size="lg"
              className="w-full"
              variant="flat"
              onPress={() => navigate(ROUTES.HOME)}
              type="button"
            >
              На головну
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
