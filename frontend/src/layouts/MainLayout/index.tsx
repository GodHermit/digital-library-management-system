import { Aside } from '@/components/Aside';
import { Header } from '@/components/Header';
import { BRAND_NAME } from '@/constants/brand';
import { useColorMode } from '@/hooks/useColorMode';
import { OnboardingPage } from '@/pages/Onboarding';
import { userService } from '@/services/userService';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { COLOR_MODE } from '@/types/settings';
import { fontSizeToPX } from '@/utils/settings';
import { ScrollShadow } from "@heroui/react";
import { useLinkAccount, useLogin } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

export function GeneralLayout() {
  const [fontSize] = useSettingsStore(useShallow(s => [s.fontSize]));
  const colorMode = useColorMode();
  const user = useUserStore(useShallow(s => s.user));

  useLogin({
    onComplete: async () => {
      await userService.registerUser();
    },
  });

  useLinkAccount({
    onSuccess: async () => {
      await userService.registerUser();
    },
  })

  useEffect(() => {
    const isDarkMode = colorMode === COLOR_MODE.DARK;

    if (isDarkMode) {
      document.documentElement.classList.add(COLOR_MODE.DARK);
      document.documentElement.classList.remove(COLOR_MODE.LIGHT);
      document.body.classList.remove(COLOR_MODE.LIGHT);
      document.body.classList.add(COLOR_MODE.DARK);
    } else {
      document.documentElement.classList.add(COLOR_MODE.LIGHT);
      document.documentElement.classList.remove(COLOR_MODE.DARK);
      document.body.classList.remove(COLOR_MODE.DARK);
      document.body.classList.add(COLOR_MODE.LIGHT);
    }
  }, [colorMode]);

  useEffect(() => {
    const fontSizeInPX = fontSizeToPX(fontSize);
    document.documentElement.style.fontSize = fontSizeInPX;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  return (
    <div className="flex min-h-screen">
      <Helmet titleTemplate={`%s | ${BRAND_NAME}`} defaultTitle={BRAND_NAME} />
      {!user || user.isOnboardingFinished ? (
        <>
          <Aside />
          <div className="flex grow flex-col">
            <Header />
            <ScrollShadow
              as="main"
              className="flex grow rounded-tl-xl bg-default-100 p-8 print:overflow-visible"
              offset={32}
            >
              <article className="prose prose-neutral h-max max-w-none grow rounded-lg bg-default-50 p-8 dark:prose-invert prose-pre:bg-transparent prose-pre:p-0">
                <Outlet />
              </article>
            </ScrollShadow>
          </div>
        </>
      ) : (
        <OnboardingPage />
      )}
      <Toaster
        position="bottom-right"
        containerStyle={{
          zIndex: 1000000,
        }}
        toastOptions={{
          className: 'text-foreground bg-default-100',
        }}
      />
    </div>
  );
}
