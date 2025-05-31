import { IOnboardingForm } from '@/pages/Onboarding/scheme';
import { shoppingCartStore } from '@/stores/soppingCart';
import { userStore } from '@/stores/user';
import { IPaginate, IPaginateParams } from '@/types/paginate';
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

  async getUsers(query: IPaginateParams<IUser>) {
    const url = '/api/users';

    const { data } = await $api.get<IPaginate<IUser>>(url, {
      params: {
        page: query.page ?? 1,
        limit: 10,
        ...query,
      },
    });

    return data;
  }

  async deleteAccount() {
    const url = '/api/users/@me';
    const { data } = await $api.delete<IUser>(url);

    const { setUser } = userStore.getState();
    setUser(undefined);

    const { clear } = shoppingCartStore.getState();
    clear();

    return data;
  }
}

export const userService = new UserService();
