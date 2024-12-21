import { COLOR_MODE, FONT_SIZE } from '@/types/settings';
import { NonFunctionProperties } from '@/types/utility';
import { persistNSync } from 'persist-and-sync';
import { create } from 'zustand';

export interface SettingsStore {
  /**
   * Whether the aside is open or not
   */
  isAsideOpen: boolean;
  setIsAsideOpen: (isOpen: boolean) => void;

  /**
   * The color mode of the application
   * @default ColorMode.SYSTEM
   */
  colorMode: COLOR_MODE;
  setColorMode: (mode: COLOR_MODE) => void;

  /**
   * The font size of the application
   * @default FontSize.SMALL
   */
  fontSize: FONT_SIZE;
  setFontSize: (size: FONT_SIZE) => void;

  /**
   * Reset the settings to the initial state
   */
  resetSettings: () => void;
}

const initialSettings: NonFunctionProperties<SettingsStore> = {
  isAsideOpen: true,
  colorMode: COLOR_MODE.SYSTEM,
  fontSize: FONT_SIZE.BASE,
};

export const settingsStore = create<SettingsStore>(
  persistNSync(
    (set) => ({
      ...initialSettings,
      setIsAsideOpen: (isOpen) => set({ isAsideOpen: isOpen }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setFontSize: (size) => set({ fontSize: size }),
      resetSettings: () => set({ ...initialSettings }),
    }),
    {
      name: 'SM-settings',
    }
  )
);

export const useSettingsStore = settingsStore;
