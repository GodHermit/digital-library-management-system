import { IPublisher } from './publisher';
import { IPublicUser } from './user';

export interface IBook {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  publishedBy: IPublicUser;
  authors: IPublicUser[];
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
