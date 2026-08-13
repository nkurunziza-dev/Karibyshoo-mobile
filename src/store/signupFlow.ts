import { create } from 'zustand';

export type SignupPending = {
  email?: string;
  accountId?: number | string;
  companyId?: number | string;
  password?: string;
};

type SignupFlowState = {
  pending: SignupPending | null;
  setPending: (value: SignupPending) => void;
  clear: () => void;
};

export const useSignupFlowStore = create<SignupFlowState>((set) => ({
  pending: null,
  setPending: (value) =>
    set((state) => ({
      pending: {
        ...state.pending,
        ...value,
      },
    })),
  clear: () => set({ pending: null }),
}));
