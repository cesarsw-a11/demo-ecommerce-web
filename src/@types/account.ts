export type Transaction = {
  id: string;
  name: string;
  balance: number;
  date: Date;
  reference: string;
  account: 'saving' | 'checking' | 'credit' | 'investment';
};

export type Account = {
  id: string;
  type: 'saving' | 'checking' | 'credit' | 'investment';
  balance: number;
  deposits: number;
  debits: number;
  number: string;
};

export type Payee = {
  id: string;
  name: string;
  account: string;
  type: string;
  zipCode?: string;
};

export type AccountState = {
  isLoading: boolean;
  error: Error | string | null;
  payeeId: string | null;
  transactions: Transaction[];
  accounts: Account[];
  payees: Payee[];
  businessPayees: Payee[];
};
