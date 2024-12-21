import { NextUIProvider } from '@nextui-org/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { PRIVY_APP_ID, privyConfig } from './configs/privy';
import { wagmiConfig } from './configs/wagmi';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  const navigate = useNavigate();

  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <NextUIProvider navigate={navigate} useHref={useHref}>
            <NextThemesProvider attribute="class">
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
