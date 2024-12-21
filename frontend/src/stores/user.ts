import { User, UserRole } from "@/types/user";
import { create } from "zustand";

export interface IUserStore {
  /**
   * The user object
   */
  user?: User;
  setUser: (user: User) => void;
}

export const userStore = create<IUserStore>((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    description: "",
    isAuthor: true,
    role: UserRole.ADMIN,
    isOnboardingFinished: true,
    createdAt: "",
    updatedAt: "",
  },
  setUser: (user) => set({ user }),
}));

export const useUserStore = userStore;
