import { IFile } from '@/types/files';
import { $api } from '.';

export class FileService {
  async uploadFiles(file: FileList): Promise<IFile[]> {
    const url = '/api/files/upload';

    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('files', file[i]);
    }

    const { data } = await $api.post<IFile[]>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
}

export const fileService = new FileService();
