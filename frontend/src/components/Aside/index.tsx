import { BRAND_NAME } from '@/constants/brand';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { ROUTES } from '@/types/routes';
import { EUserRole, EUserType } from '@/types/user';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookIcon,
  BookUpIcon,
  CircleHelpIcon,
  CompassIcon,
  DollarSignIcon,
  HomeIcon,
  LibraryBigIcon,
  ShoppingCartIcon,
  UsersIcon,
} from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import { useShallow } from 'zustand/shallow';
import { AsideItem } from './components';

export function Aside() {
  const [isAsideOpen] = useSettingsStore(useShallow(s => [s.isAsideOpen]));
  const [isAsideOpenDebounce] = useDebounceValue(isAsideOpen, 300);
  const isAsideOpenAnimated = isAsideOpenDebounce && isAsideOpen;
  const user = useUserStore(useShallow(s => s.user));

  return (
    <aside
      className={clsx(
        'flex h-screen max-h-screen flex-col gap-2 overflow-y-auto overflow-x-hidden bg-default-50 p-4 transition-all duration-300 print:hidden',
        {
          'w-[18.75rem] min-w-[18.75rem]': isAsideOpen,
          'w-[4.5rem] min-w-[4.5rem]': !isAsideOpen,
        }
      )}
    >
      <div className="mb-4 flex h-[2.1875rem] items-baseline gap-2 text-2xl font-bold leading-none">
        <LibraryBigIcon width={40} height={40} className="translate-y-1" />
        {isAsideOpenAnimated && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {BRAND_NAME}
          </motion.span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <AsideItem
          href={ROUTES.HOME}
          isAsideOpen={isAsideOpen}
          isAsideOpenAnimated={isAsideOpenAnimated}
          icon={<HomeIcon />}
        >
          Головна
        </AsideItem>
        {user?.role === EUserRole.USER && (
          <>
            <AsideItem
              href={ROUTES.BOOKS}
              isAsideOpen={isAsideOpen}
              isAsideOpenAnimated={isAsideOpenAnimated}
              icon={<CompassIcon />}
            >
              Каталог
            </AsideItem>
            <AsideItem
              href={ROUTES.USER}
              isAsideOpen={isAsideOpen}
              isAsideOpenAnimated={isAsideOpenAnimated}
              icon={<BookIcon />}
            >
              Моя бібліотека
            </AsideItem>
            {(user.userType === EUserType.AUTHOR ||
              user.userType === EUserType.PUBLISHER) && (
              <AsideItem
                href={ROUTES.USER_PUBLISHED_BOOKS}
                isAsideOpen={isAsideOpen}
                isAsideOpenAnimated={isAsideOpenAnimated}
                icon={<BookUpIcon />}
              >
                Опубліковані книги
              </AsideItem>
            )}
          </>
        )}
        {user?.role === EUserRole.ADMIN && (
          <>
            <AsideItem
              href={ROUTES.BOOKS}
              isAsideOpen={isAsideOpen}
              isAsideOpenAnimated={isAsideOpenAnimated}
              icon={<LibraryBigIcon />}
            >
              Інвентар
            </AsideItem>
            <AsideItem
              href={ROUTES.USERS}
              isAsideOpen={isAsideOpen}
              isAsideOpenAnimated={isAsideOpenAnimated}
              icon={<UsersIcon />}
            >
              Користувачі
            </AsideItem>
            <AsideItem
              href={ROUTES.ORDERS}
              isAsideOpen={isAsideOpen}
              isAsideOpenAnimated={isAsideOpenAnimated}
              icon={<ShoppingCartIcon />}
            >
              Замовлення
            </AsideItem>
          </>
        )}
        <div className="-mx-4 my-2 border-b border-default-200" />
        <AnimatePresence>
          {isAsideOpenAnimated && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: '-0.25rem' }}
              animate={{ opacity: 1, height: 'auto', marginBottom: '0.5rem' }}
              exit={{ opacity: 0, height: 0, marginBottom: '-0.25rem' }}
              className="text-xs font-bold text-default-500"
            >
              Додатково
            </motion.div>
          )}
        </AnimatePresence>
        <AsideItem
          href={ROUTES.FAQ}
          isAsideOpen={isAsideOpen}
          isAsideOpenAnimated={isAsideOpenAnimated}
          icon={<CircleHelpIcon />}
        >
          ЧаПи (FAQ)
        </AsideItem>
        <AsideItem
          href={ROUTES.DONATE}
          isAsideOpen={isAsideOpen}
          isAsideOpenAnimated={isAsideOpenAnimated}
          icon={<DollarSignIcon />}
        >
          Пожертвування
        </AsideItem>
      </div>
    </aside>
  );
}
