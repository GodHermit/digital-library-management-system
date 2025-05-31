import { EUserType } from '@/types/user';

export interface IOnboardingForm {
  fullName: string;
  email: string;
  description: string;
  userType: EUserType;
  organization: {
    name: string;
    website: string;
  };
}
