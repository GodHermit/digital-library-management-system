import { IOnboardingForm } from '@/pages/Onboarding/scheme';
import { userStore } from '@/stores/user';
import { IUser } from '@/types/user';
import { addErrorToast } from '@/utils/errorToast';
import { $api } from '.';

export class UserService {
  async registerUser() {
    const url = '/api/auth/register';
    const { data } = await $api.post<IUser>(url);

    const { setUser } = userStore.getState();

    setUser(data);

    return data;
  }

  async getUser() {
    const url = '/api/users/@me';
    const { data } = await $api.get<IUser>(url);

    const { setUser } = userStore.getState();

    setUser(data);

    return data;
  }

  async finishOnboarding(formData: IOnboardingForm) {
    try {
      const url = '/api/users/onboarding';
      const { data } = await $api.post<IUser>(url, formData);

      const { setUser } = userStore.getState();

      setUser(data);

      return data;
    } catch (error) {
      addErrorToast(error);
      throw error;
    }
  }
}

export const userService = new UserService();
