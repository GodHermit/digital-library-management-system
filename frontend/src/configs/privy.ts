import { BRAND_NAME } from '@/constants/brand';
import { PrivyClientConfig } from '@privy-io/react-auth';
import { TARGET_CHAIN } from './wagmi';

export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

export const privyConfig: PrivyClientConfig = {
  defaultChain: TARGET_CHAIN,
  supportedChains: [TARGET_CHAIN],
  appearance: {
    theme: '#18181B',
    accentColor: '#006FEE',
    landingHeader: `Welcome to ${BRAND_NAME} 🌹`,
    loginMessage: 'Log in or Sign up',
  },
  intl: {
    defaultCountry: 'UA',
  },
};
