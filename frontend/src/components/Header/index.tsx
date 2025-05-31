import { useSettingsStore } from '@/stores/settings';
import { Badge, Button, Kbd, Tooltip } from '@heroui/react';
import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SearchIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { SearchModal } from '../SearchModal';
import { UserButton } from './components/UserButton';
import { Link } from 'react-router';
import { ROUTES } from '@/types/routes';
import { useShoppingCartStore } from '@/stores/soppingCart';

export function Header() {
  const [isAsideOpen, setIsAsideOpen] = useSettingsStore(
    useShallow(s => [s.isAsideOpen, s.setIsAsideOpen])
  );
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const totalItemsInCart = useShoppingCartStore(
    useShallow(s => s.items.length)
  );

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  return (
    <header className="flex items-center gap-2 bg-default-50 py-4 pr-4 print:hidden">
      <Tooltip
        placement="bottom"
        delay={2000}
        content={isAsideOpen ? 'Close menu' : 'Open menu'}
      >
        <Button isIconOnly onPress={toggleAside}>
          {isAsideOpen ? <PanelLeftCloseIcon /> : <PanelLeftIcon />}
        </Button>
      </Tooltip>
      <Tooltip
        placement="bottom"
        delay={1000}
        content={
          <div className="flex items-center gap-2">
            Пошук <Kbd keys={['command']}>K</Kbd>
          </div>
        }
      >
        <Button
          isIconOnly
          className="ml-auto"
          onPress={() => setIsSearchModalOpen(true)}
        >
          <SearchIcon />
        </Button>
      </Tooltip>

      <Badge color="primary" content={totalItemsInCart}>
        <Tooltip placement="bottom" delay={1000} content="Кошик покупок">
          <Button isIconOnly as={Link} to={ROUTES.SHOPPING_CART}>
            <ShoppingCartIcon />
          </Button>
        </Tooltip>
      </Badge>
      <UserButton />
      <SearchModal
        isOpen={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </header>
  );
}
