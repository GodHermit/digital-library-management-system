import { IPublisher } from './publisher';
import { IPublicUser } from './user';

export interface IBook {
  id: string;
  title: string;
  description: string;
  publishedAt: Date;
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
}

export interface IGenre {
  id: string;
  name: string;
}
