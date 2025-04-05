import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { userService } from '@/services/userService';
import { getAccessToken, useLogin } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export function DevelopmentHelper() {
  const [privyToken, setPrivyToken] = useState<string | undefined>();
  const [copiedText, copy] = useCopyToClipboard();

  const { login } = useLogin({
    async onComplete() {
      await userService.registerUser();

      const accessToken = await getAccessToken();
      setPrivyToken(accessToken || undefined);
    },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      const accessToken = await getAccessToken();
      setPrivyToken(accessToken || undefined);
    };

    fetchTokens();
  }, []);

  return (
    <>
      <b>Privy token:</b>
      <p>{privyToken || 'User not authorized'}</p>
      {privyToken && (
        <button
          className="max-w-max break-words rounded-full border px-4 py-1 transition-colors duration-300 hover:bg-gray-50"
          onClick={() => copy(privyToken || '')}
        >
          {copiedText === privyToken ? 'Copied!' : 'Copy'}
        </button>
      )}
      {!privyToken && (
        <button
          className="max-w-max rounded-full border px-4 py-1 transition-colors duration-300 hover:bg-gray-50"
          onClick={login}
        >
          Log in
        </button>
      )}
    </>
  );
}
