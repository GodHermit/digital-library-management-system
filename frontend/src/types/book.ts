import { IPublisher } from './publisher';
import { IPublicUser } from './user';

export interface IBook {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  publishedBy: IPublicUser;
  authors?: IPublicUser[];
  language: string;
  coverUrl?: string;
  priceInETH: number;
  publisher?: IPublisher;
  genres: IGenre[];
  seriesId?: string;
  edition?: string;
  format?: string;
  asin?: string;
  isbn?: string;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;

  status?: EStatus;
}

export interface IGenre {
  id: string;
  name: string;
}

export enum EStatus {
  Planning = 'planning',
  InProgress = 'reading',
  Done = 'done',
  ReInProgress = 're-reading',
  Paused = 'paused',
}

export interface IBookCreate {
  title: string;
  description: string;
  publishedAt: string;
  publishedByUserId: string;
  language: string;
  coverUrl?: string;
  priceInETH: number;
  publisherId?: string;
  authorIds?: string[];
  genreIds: string[];
  seriesId?: string;
  edition?: string;
  format?: string;
  fileUrl?: string;
  asin?: string;
  isbn?: string;
}

export type IBookUpdate = Partial<IBookCreate>;
