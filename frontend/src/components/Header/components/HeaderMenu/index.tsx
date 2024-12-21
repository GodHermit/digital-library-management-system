import { ShareModal } from '@/components/ShareModal';
import { BASE_SHORTCUT_KEY } from '@/constants/shortcuts';
import { useShortcut } from '@/hooks/useShortcut';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';
import { EllipsisVerticalIcon, Share2Icon } from 'lucide-react';
import { useState } from 'react';
import { BrowserView } from 'react-device-detect';
import { useLocation, useParams } from 'react-router-dom';

export function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { articleId } = useParams();
  const { pathname } = useLocation();
  const isArticlePage = !!articleId || pathname === '/';

  useShortcut(
    () => {
      if (isArticlePage) {
        setIsOpen(false);
        setIsShareModalOpen(true);
      }
    },
    ['s'],
    {
      metaKey: true,
      shiftKey: true,
    }
  );

  return (
    <>
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} backdrop="blur">
        <Tooltip placement="bottom" delay={1000} content="More actions">
          <div>
            <DropdownTrigger content="More actions">
              <Button
                isIconOnly
                className={clsx(isOpen && 'relative z-[1000000]')}
              >
                <EllipsisVerticalIcon />
              </Button>
            </DropdownTrigger>
          </div>
        </Tooltip>
        <DropdownMenu disabledKeys={isArticlePage ? [] : ['share', 'print']}>
          <DropdownItem
            key="share"
            shortcut={<BrowserView>{BASE_SHORTCUT_KEY}⇧S</BrowserView>}
            startContent={<Share2Icon />}
            description="Share current article with friends"
            onPress={() => setIsShareModalOpen(true)}
          >
            Share
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ShareModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
      />
    </>
  );
}
