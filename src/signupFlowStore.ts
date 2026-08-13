import { create } from 'zustand';

export type SignupFlowData = {
  email?: string;
  accountId?: number | string;
  companyId?: number | string;
  password?: string;
};

type SignupFlowState = SignupFlowData & {
  setPending: (data: SignupFlowData) => void;
  clear: () => void;
};

const initialState: SignupFlowData = {
  email: undefined,
  accountId: undefined,
  companyId: undefined,
  password: undefined,
};

export const useSignupFlowStore = create<SignupFlowState>((set) => ({
  ...initialState,
  setPending: (data) => set({ ...initialState, ...data }),
  clear: () => set(initialState),
}));

export default useSignupFlowStore;
