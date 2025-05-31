import { useEffect } from 'react';

interface ShortcutOptions {
  altKey?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  ref?: React.RefObject<HTMLElement>;
}

export function useShortcut(
  callback: () => void,
  keyCodes: string[],
  options?: ShortcutOptions
): void {
  const handler = (e: KeyboardEvent) => {
    const { key, altKey, metaKey, ctrlKey, shiftKey } = e;
    if (
      keyCodes.includes(key) &&
      !!options?.altKey === altKey &&
      !!options?.metaKey === metaKey &&
      !!options?.ctrlKey === ctrlKey &&
      !!options?.shiftKey === shiftKey
    ) {
      console.log(key);

      e.preventDefault();
      callback();
      return false;
    }
  };

  useEffect(() => {
    if (options?.ref?.current) {
      options?.ref.current.addEventListener('keydown', handler, false);
    } else {
      document.addEventListener('keydown', handler, false);
    }
    return () => {
      if (options?.ref?.current) {
        options?.ref.current.removeEventListener('keydown', handler, false);
      } else {
        document.removeEventListener('keydown', handler, false);
      }
    };
  }, [options?.ref]);
}
