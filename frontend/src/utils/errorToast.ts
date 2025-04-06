import { addToast } from '@heroui/toast';
import { AxiosError } from 'axios';
import { BaseError } from 'viem';

export const addErrorToast = (error: unknown) => {
  if (error instanceof BaseError) {
    addToast({
      title: error.shortMessage as string,
      severity: 'danger',
      color: 'danger',
    });
  } else if (error instanceof AxiosError) {
    addToast({
      title: error.message,
      description: error.response?.data.message,
      severity: 'danger',
      color: 'danger',
    });
  } else if (error instanceof Error) {
    addToast({
      title: error.message,
      severity: 'danger',
      color: 'danger',
    });
  } else {
    addToast({
      title: 'Unknown error',
      severity: 'danger',
      color: 'danger',
    });
  }
};
