export interface IPublisher {
  id: string;
  name: string;
  website?: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPublisherCreate = Omit<IPublisher, 'id' | 'createdAt' | 'updatedAt'>;
