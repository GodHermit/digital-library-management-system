import { isMacOs } from "react-device-detect";

export const BASE_SHORTCUT_KEY = isMacOs ? '⌘' : 'Ctrl';
