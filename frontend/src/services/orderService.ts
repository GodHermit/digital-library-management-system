import { digitalLibraryAbi } from '@/abis/digital-library';
import { wagmiConfig } from '@/configs/wagmi';
import { DIGITAL_LIBRARY_CONTRACT } from '@/constants/contracts';
import { ICheckoutForm } from '@/pages/Checkout/scheme';
import { IOrder } from '@/types/order';
import { ROUTES } from '@/types/routes';
import { addToast } from '@heroui/toast';
import { NavigateFunction } from 'react-router';
import { parseEther } from 'viem';
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'wagmi/actions';
import { $api } from '.';

export class OrderService {
  async getOrderById(id: string) {
    const url = `/api/orders/${id}`;
    const { data } = await $api.get<IOrder>(url);
    console.log(data);

    return data;
  }

  async createOrder(
    formData: ICheckoutForm,
    totalPrice: number,
    navigateCallback: NavigateFunction
  ) {
    const url = '/api/orders';
    const { data } = await $api.post<IOrder>(url, { bookIds: formData.items });

    const orderId = data.id;

    navigateCallback(ROUTES.CHECKOUT_ORDER.replace(':id', orderId));

    await this.payOrder(orderId, totalPrice);

    addToast({
      title: 'Замовлення успішно створено',
      description: 'Очікуйте завершення',
      severity: 'success',
    });
  }

  async payOrder(orderId: string, totalPrice: number) {
    const { request } = await simulateContract(wagmiConfig, {
      address: DIGITAL_LIBRARY_CONTRACT,
      abi: digitalLibraryAbi,
      functionName: 'payOrder',
      args: [orderId],
      value: parseEther(totalPrice.toFixed(18)),
    });

    const hash = await writeContract(wagmiConfig, request);

    addToast({
      title: 'Транзакція відправлена в обробку',
      shouldShowTimeoutProgress: true,
      severity: 'success',
      promise: waitForTransactionReceipt(wagmiConfig, {
        hash,
      }),
    });

    await waitForTransactionReceipt(wagmiConfig, {
      hash,
    });
  }
}

export const orderService = new OrderService();
