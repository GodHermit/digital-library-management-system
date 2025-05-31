import { FONT_SIZE } from "@/types/settings";

export const fontSizeToPX = (fontSize: FONT_SIZE) => {
  switch (fontSize) {
    case FONT_SIZE.SMALL:
      return '14px';
    case FONT_SIZE.BASE:
      return '16px';
    case FONT_SIZE.MEDIUM:
      return '18px';
    case FONT_SIZE.LARGE:
      return '20px';
    case FONT_SIZE.EXTRA_LARGE:
      return '24px';
  }
};
