import { IUser } from "@/types/user";
import { create } from "zustand";

export interface IUserStore {
  /**
   * The user object
   */
  user?: IUser;
  setUser: (user?: IUser) => void;
}

export const userStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

export const useUserStore = userStore;
