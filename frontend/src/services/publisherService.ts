import { IPublisher } from '@/types/publisher';
import { $api } from '.';

export class PublisherService {
  async getPublishers() {
    const url = `/api/publishers`;
    const { data } = await $api.get<IPublisher[]>(url);
    return data;
  }
}

export const publisherService = new PublisherService();
