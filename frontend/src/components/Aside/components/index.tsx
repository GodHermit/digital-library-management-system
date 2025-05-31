import { Button, Tooltip } from "@heroui/react";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';

interface AsideItemProps {
  children: ReactNode;
  href: string;
  isAsideOpen?: boolean;
  isAsideOpenAnimated?: boolean;
  icon?: ReactNode;
}

export function AsideItem({
  children,
  href,
  isAsideOpen,
  isAsideOpenAnimated,
  icon,
}: AsideItemProps) {
  const { pathname } = useLocation();

  return (
    <Tooltip placement="right" content={children} isDisabled={isAsideOpen}>
      <Button
        as={NavLink}
        to={href}
        variant={pathname === href ? 'flat' : 'light'}
        color={pathname === href ? 'default' : 'default'}
        isIconOnly={!isAsideOpenAnimated}
        startContent={icon}
        className={clsx('min-h-10', {
          'justify-start !px-2': isAsideOpenAnimated,
        })}
      >
        {isAsideOpenAnimated && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.span>
        )}
      </Button>
    </Tooltip>
  );
}
