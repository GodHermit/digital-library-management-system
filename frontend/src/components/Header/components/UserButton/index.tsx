import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useUserStore } from '@/stores/user';
import { ROUTES } from '@/types/routes';
import { formatAddress } from '@/utils/address';
import {
  addToast,
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  User,
} from '@heroui/react';
import { usePrivy } from '@privy-io/react-auth';
import {
  BookIcon,
  Link2Icon,
  Link2OffIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useAccount, useDisconnect } from 'wagmi';
import { useShallow } from 'zustand/shallow';

export function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    authenticated: isAuthenticated,
    ready: isReady,
    user: privyUser,
    login,
    logout,
    linkWallet,
  } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const isLoginDisabled = !isReady || (isReady && isAuthenticated);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copy] = useCopyToClipboard();
  const user = useUserStore(useShallow(s => s.user));

  if (!isAuthenticated) {
    return (
      <Button
        isDisabled={isLoginDisabled}
        color="primary"
        onPress={() => login()}
      >
        Увійти
      </Button>
    );
  }

  const handleCopyAddress = () => {
    if (!address) {
      return;
    }

    copy(address);
    addToast({ title: 'Адресу скопійовано' });
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom"
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button
            className="relative aria-expanded:z-[99999999]"
            isIconOnly
            aria-label="User"
          >
            <UserIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-screen max-w-[21rem] items-start p-2">
          <User
            name={
              <div className="flex flex-col items-start gap-1">
                {privyUser?.email?.address && (
                  <div className="font-bold">{privyUser?.email?.address}</div>
                )}
                {!address && (
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="h-auto px-2 py-0"
                    startContent={<Link2Icon width={16} height={16} />}
                    onPress={() => linkWallet()}
                  >
                    Підключити гаманець
                  </Button>
                )}
                {address && (
                  <div className="flex gap-1">
                    <Tooltip placement="bottom" content={address}>
                      <span
                        className="cursor-pointer text-xs"
                        onClick={handleCopyAddress}
                      >
                        {formatAddress(address)}
                      </span>
                    </Tooltip>
                    <Tooltip
                      color="danger"
                      placement="bottom"
                      content="Відключити гаманець"
                    >
                      <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        className="h-auto p-0"
                        isIconOnly
                        startContent={<Link2OffIcon width={16} height={16} />}
                        onPress={() => disconnect()}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            }
            avatarProps={{
              radius: 'sm',
              icon: <UserIcon />,
            }}
          />
          <Divider className="mb-1 mt-2" />
          <Listbox variant="flat" className="px-0">
            <ListboxItem
              key={ROUTES.USER}
              as={Link}
              // @ts-expect-error - `to` prop is missing
              to={ROUTES.USER}
              startContent={<BookIcon width={16} height={16} />}
              onPress={() => setIsOpen(false)}
            >
              Моя бібліотека
            </ListboxItem>
            <ListboxItem
              key="mySettings"
              as={Link}
              // @ts-expect-error - `to` prop is missing
              to={ROUTES.SETTINGS}
              startContent={<SettingsIcon width={16} height={16} />}
              onPress={() => setIsOpen(false)}
            >
              Налаштування
            </ListboxItem>
            <ListboxItem
              key="logOut"
              className="text-danger"
              color="danger"
              startContent={<LogOutIcon width={16} height={16} />}
              onPress={() => logout()}
            >
              Вийти
            </ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
    </>
  );
}
