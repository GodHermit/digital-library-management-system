import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useUserStore } from '@/stores/user';
import { ROUTES } from '@/types/routes';
import { formatAddress } from '@/utils/address';
import {
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  User,
} from '@nextui-org/react';
import { usePrivy } from '@privy-io/react-auth';
import {
  BookIcon,
  BookUpIcon,
  Link2Icon,
  Link2OffIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
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
    connectWallet,
  } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const isLoginDisabled = !isReady || (isReady && isAuthenticated);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copy] = useCopyToClipboard();
  const user = useUserStore(useShallow((s) => s.user));

  if (!isAuthenticated) {
    return (
      <Button
        isDisabled={isLoginDisabled}
        color="primary"
        onPress={() => login()}
      >
        Log in
      </Button>
    );
  }

  const handleCopyAddress = () => {
    if (!address) {
      return;
    }

    copy(address);
    toast.success('Адресу скопійовано');
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
          <Button className="relative aria-expanded:z-[99999999]" isIconOnly>
            <UserIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="items-start w-screen max-w-[21rem] p-2">
          <User
            name={
              <div className="flex flex-col gap-1 items-start">
                {privyUser?.email?.address && (
                  <div className="font-bold">{privyUser?.email?.address}</div>
                )}
                {!address && (
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="py-0 px-2 h-auto"
                    startContent={<Link2Icon width={16} height={16} />}
                    onPress={() => connectWallet()}
                  >
                    Підключити гаманець
                  </Button>
                )}
                {address && (
                  <div className="flex gap-1">
                    <Tooltip placement="bottom" content={address}>
                      <span
                        className="text-xs cursor-pointer"
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
                        className="py-0 px-0 h-auto"
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
          <Divider className="mt-2 mb-1" />
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
            {user?.isAuthor ? (
              <ListboxItem
                key="publishedBooks"
                as={Link}
                // @ts-expect-error - `to` prop is missing
                to={ROUTES.USER_PUBLISHED_BOOKS}
                startContent={<BookUpIcon width={16} height={16} />}
                onPress={() => setIsOpen(false)}
              >
                Опубліковані книги
              </ListboxItem>
            ) : (
              <></>
            )}
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
