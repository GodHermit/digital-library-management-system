import { ToastProvider } from '@heroui/toast';
import { HeroUIProvider } from '@heroui/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { useHref, useNavigate } from 'react-router';
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
          <HeroUIProvider navigate={navigate} useHref={useHref} locale="uk-UA">
            <NextThemesProvider attribute="class">
              {children}
              <ToastProvider placement="top-right" toastOffset={80} />
            </NextThemesProvider>
          </HeroUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
