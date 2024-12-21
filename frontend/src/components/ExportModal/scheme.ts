import * as z from 'zod';

export enum ExportType {
  CURRENT_ARTICLE = 'Current article',
  ALL_ARTICLES_IN_ONE_FILE = 'All articles in one file',
  ALL_ARTICLES_IN_A_ZIP_ARCHIVE = 'All articles in a zip archive',
}

export enum ExportFormat {
  MARKDOWN = 'Markdown',
  HTML = 'HTML',
}

export interface ExportFormScheme {
  type: ExportType;
  format: ExportFormat;
  shouldIncludeMedia: boolean;
}

export const ExportFormScheme = z.object({
  type: z.nativeEnum(ExportType, { message: 'Please select export type' }),
  format: z.nativeEnum(ExportFormat, { message: 'Please select format' }),
  shouldIncludeMedia: z.boolean(),
});

export type ExportFormSchemeType = z.infer<typeof ExportFormScheme>;
