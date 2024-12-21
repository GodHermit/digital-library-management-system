import { Aside } from '@/components/Aside';
import { Header } from '@/components/Header';
import { BRAND_NAME } from '@/constants/brand';
import { useColorMode } from '@/hooks/useColorMode';
import { OnboardingPage } from '@/pages/Onboarding';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { COLOR_MODE } from '@/types/settings';
import { fontSizeToPX } from '@/utils/settings';
import { ScrollShadow } from '@nextui-org/react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

export function GeneralLayout() {
  const [fontSize] = useSettingsStore(useShallow((s) => [s.fontSize]));
  const colorMode = useColorMode();
  const user = useUserStore(useShallow((s) => s.user));

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

  useEffect(() => {
    // articlesService.getArticles();
  }, []);

  return (
    <div className="flex h-screen">
      <Helmet titleTemplate={`%s | ${BRAND_NAME}`} defaultTitle={BRAND_NAME} />
      {user?.isOnboardingFinished ? (
        <>
          <Aside />
          <div className="flex grow flex-col">
            <Header />
            <ScrollShadow
              as="main"
              className="flex p-8 bg-default-100 grow rounded-tl-xl print:overflow-visible"
              offset={32}
            >
              <article className="bg-default-50 rounded-lg p-8 grow h-max max-w-none prose prose-neutral prose-pre:p-0 prose-pre:bg-transparent dark:prose-invert">
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
