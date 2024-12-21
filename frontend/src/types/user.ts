export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  description: string;
  role: UserRole;
  isAuthor: boolean;
  isOnboardingFinished: boolean;
  createdAt: string;
  updatedAt: string;
}
