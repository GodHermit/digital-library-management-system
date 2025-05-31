import { COLOR_SCHEME_QUERY } from '@/constants/mediaQuery';
import { useSettingsStore } from '@/stores/settings';
import { COLOR_MODE } from '@/types/settings';
import { useMediaQuery } from 'usehooks-ts';

/**
 * Hook to get the current color mode
 * @returns The current color mode (dark or light)
 * @example
 * const colorMode = useColorMode();
 */
export function useColorMode() {
  const colorMode = useSettingsStore((s) => s.colorMode);
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  const isDarkMode = colorMode === 'system' ? isDarkOS : colorMode === 'dark';

  return isDarkMode ? COLOR_MODE.DARK : COLOR_MODE.LIGHT;
}
