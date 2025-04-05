import { useCallback, useEffect, useState } from 'react';

function oldCopyMethod(text: string) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

/**
 * Hook to copy text to clipboard
 * @param resetAfterMs - reset the state after this time
 * @returns copied text and a function to copy text to clipboard
 */
export const useCopyToClipboard = (
  resetAfterMs = 0
): [string | null, (value: string) => void] => {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    if (state === null || resetAfterMs <= 0) return;

    const timeout = setTimeout(() => {
      setState(null);
    }, resetAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [state, resetAfterMs]);

  const copyToClipboard = useCallback((value: string) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setState(value);
        } else {
          throw new Error('writeText not supported');
        }
      } catch {
        oldCopyMethod(value);
        setState(value);
      }
    };

    handleCopy().catch((error) => {
      console.error(error);
    });
  }, []);

  return [state, copyToClipboard];
};
