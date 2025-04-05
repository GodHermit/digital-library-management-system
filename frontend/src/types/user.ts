import { IPublisher } from "./publisher";
import { IWallet } from "./wallet";

export enum EUserType {
  DEFAULT = 'default',
  AUTHOR = 'author',
  PUBLISHER = 'publisher',
}

export enum EUserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  description?: string;
  userType: EUserType;
  role: EUserRole;
  isOnboardingFinished: boolean;
  wallets?: IWallet[];

  organization?: IPublisher;
  createdAt: string;
  updatedAt: string;
}

export interface IPublicUser {
  id: string;
  email?: string;
  fullName?: string;
}
