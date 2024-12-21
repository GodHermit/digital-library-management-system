import { CustomMetadataType } from '@privy-io/public-api';
import axios from 'axios';

export class PrivyService {
  async setCustomMetadata(did: string, metadata: CustomMetadataType) {
    const url = `https://auth.privy.io/api/v1/users/${did}/custom_metadata`;
    const { data } = await axios.post(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PRIVY_API_KEY}`,
      },
      body: JSON.stringify(metadata),
    });

    return data;
  }
}

export const privyService = new PrivyService();
