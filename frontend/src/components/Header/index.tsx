import { useSettingsStore } from '@/stores/settings';
import { Button, Kbd, Tooltip } from '@nextui-org/react';
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { SearchModal } from '../SearchModal';
import { UserButton } from './components/UserButton';

export function Header() {
  const [isAsideOpen, setIsAsideOpen] = useSettingsStore(
    useShallow((s) => [s.isAsideOpen, s.setIsAsideOpen])
  );
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  return (
    <header className="flex items-center gap-2 py-4 pr-4 bg-default-50 print:hidden">
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
            Search <Kbd keys={['command']}>K</Kbd>
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
      {/* <Tooltip placement="bottom" delay={1000} content="Settings">
        <Button as={Link} to={ROUTES.SETTINGS} isIconOnly>
          <SettingsIcon />
        </Button>
      </Tooltip> */}
      <UserButton />
      {/* <HeaderMenu /> */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </header>
  );
}
