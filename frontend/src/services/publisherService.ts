import { IPublisher, IPublisherCreate } from '@/types/publisher';
import { $api } from '.';

export class PublisherService {
  async getPublishers() {
    const url = `/api/publishers`;
    const { data } = await $api.get<IPublisher[]>(url);
    return data;
  }

  async createPublisher(publisher: IPublisherCreate) {
    const url = `/api/publishers`;
    const { data } = await $api.post<IPublisher>(url, publisher);
    return data;
  }

  async updatePublisher(id: string, publisher: Partial<IPublisherCreate>) {
    const url = `/api/publishers/${id}`;
    const { data } = await $api.put<IPublisher>(url, publisher);
    return data;
  }

  async deletePublisher(id: string) {
    const url = `/api/publishers/${id}`;
    await $api.delete(url);
  }
}

export const publisherService = new PublisherService();
