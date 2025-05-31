import { TARGET_CHAIN, wagmiConfig } from '@/configs/wagmi';
import { PLATFORM_WALLET } from '@/constants';
import { DONATELLO_PAGE } from '@/constants/brand';
import { addErrorToast } from '@/utils/errorToast';
import { Button, Form, Input } from "@heroui/react";
import { usePrivy } from '@privy-io/react-auth';
import { HeartIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { parseEther } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { sendTransaction, waitForTransactionReceipt } from 'wagmi/actions';

export function DonatePage() {
  const { chainId, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connectWallet } = usePrivy();
  const { switchChainAsync } = useSwitchChain();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) {
      connectWallet();
      return;
    }
    setIsSubmitting(true);
    try {
      if (chainId !== TARGET_CHAIN.id) {
        await switchChainAsync({
          chainId: TARGET_CHAIN.id,
        });
      }
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const amount = data.amount as string;
      const tx = await sendTransaction(wagmiConfig, {
        to: PLATFORM_WALLET,
        value: parseEther(amount),
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
      });
      toast.success('Дякуємо за пожертву!');
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>Пожертвування</h1>
      <p>
        Якщо вам подобається цей проект, будь ласка, розгляньте можливість
        пожертвування для підтримки розробки ❤️
      </p>
      <h2>
        <span role="img" aria-label="heart">
          ❤️
        </span>{' '}
        Підтримати напряму
      </h2>
      <div className="max-w-xs">
        <Form validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            label="Сума"
            labelPlacement="outside"
            type="number"
            name="amount"
            variant="bordered"
            placeholder="0.0001"
            step="0.00001"
            endContent="ETH"
            min="0"
            isRequired
            isDisabled={isSubmitting}
          />
          <Button
            type="submit"
            variant="solid"
            color="primary"
            className="w-full"
            isLoading={isSubmitting}
            endContent={
              <HeartIcon width={16} height={16} fill="currentColor" />
            }
          >
            Підтримати
          </Button>
        </Form>
      </div>
      <h2>
        <span role="img" aria-label="heart">
          ❤️
        </span>{' '}
        Підтримати через інші сервіси
      </h2>
      <div className="max-w-xs">
        <Button
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full no-underline"
          href={DONATELLO_PAGE}
        >
          Donatello
        </Button>
      </div>
    </>
  );
}
