export const translateLocale = (value: string, fallbackValue: string) => {
  try {
    return new Intl.DisplayNames(['uk'], { type: 'language' }).of(value);
  } catch (error) {
    console.error('Error translating locale:', error);
    return fallbackValue;
  }
};
