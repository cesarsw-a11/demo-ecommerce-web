import { map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import { AccountState, Transaction, Payee } from '../../@types/account';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState: AccountState = {
  isLoading: false,
  error: null,
  payeeId: null,
  transactions: [
    {
      id: new Date(2021, 11, 12, 11).toString(),
      name: 'Cable Co. Refund',
      balance: 83.95,
      date: new Date(2021, 11, 12, 11),
      reference: '12.12.2021',
      account: 'saving'
    },
    {
      id: new Date(2021, 11, 12, 10).toString(),
      name: 'Coffe Gallery',
      balance: -15.9,
      date: new Date(2021, 11, 12, 10),
      reference: '2021-12-12',
      account: 'saving'
    },
    {
      id: new Date(2021, 11, 2, 10).toString(),
      name: 'Grocery Store',
      balance: -57.99,
      date: new Date(2021, 11, 2, 10),
      reference: '2021-12-02',
      account: 'saving'
    },
    {
      id: new Date(2021, 10, 29, 11).toString(),
      name: 'Sneakers Shop',
      balance: -250,
      date: new Date(2021, 10, 29, 11),
      reference: '2021-11-29',
      account: 'saving'
    },
    {
      id: new Date(2021, 10, 29, 10, 50).toString(),
      name: 'Flight Compensation',
      balance: 362,
      date: new Date(2021, 10, 29, 10, 50),
      reference: '2021-11-29',
      account: 'saving'
    },
    {
      id: new Date(2021, 10, 29, 10).toString(),
      name: 'Medicine',
      balance: -158,
      date: new Date(2021, 10, 29, 10),
      reference: '2021-11-29',
      account: 'saving'
    },
    {
      id: new Date(2021, 10, 28, 10).toString(),
      name: 'ATM withdrawal',
      balance: -300,
      date: new Date(2021, 10, 28, 10),
      reference: '2021-11-28',
      account: 'saving'
    },
    {
      id: new Date(2021, 10, 26, 10).toString(),
      name: 'Restaurant',
      balance: -38.49,
      date: new Date(2021, 10, 26, 10),
      reference: '2021-11-26',
      account: 'saving'
    }
  ],
  accounts: [
    {
      id: new Date(2021, 11, 12, 10).toString(),
      type: 'saving',
      balance: 15260,
      deposits: 1500.5,
      debits: -360,
      number: '**** **** **** 3286'
    },
    {
      id: new Date(2021, 11, 2, 10).toString(),
      type: 'checking',
      balance: 758.33,
      deposits: 1500.5,
      debits: -360,
      number: '**** **** **** 3432'
    }
  ],
  payees: [
    {
      id: new Date(2021, 11, 12, 10).toString(),
      name: 'Kathryn Murphy',
      account: '****4458',
      type: 'Personal'
    },
    {
      id: new Date(2021, 11, 11, 10).toString(),
      name: 'Jane Cooper',
      account: '****7348',
      type: 'Personal'
    },
    {
      id: new Date(2021, 11, 10, 10).toString(),
      name: 'Emily Jones',
      account: '****5209',
      type: 'Personal'
    },
    {
      id: new Date(2021, 11, 9, 10).toString(),
      name: 'Sam Miller',
      account: '****1622',
      type: 'Personal'
    },
    {
      id: new Date(2021, 11, 8, 10).toString(),
      name: 'James Smith',
      account: '****1247',
      type: 'Business'
    },
    {
      id: new Date(2021, 11, 7, 10).toString(),
      name: 'Ronald Richard',
      account: '****3997',
      type: 'Business'
    }
  ],
  businessPayees: [
    {
      id: new Date(2021, 11, 12, 10).toString(),
      name: 'Electric Company',
      account: '****4821',
      type: 'Business'
    },
    {
      id: new Date(2021, 11, 11, 10).toString(),
      name: 'Auto Insurance',
      account: '****1909',
      type: 'Business'
    },
    {
      id: new Date(2021, 11, 10, 10).toString(),
      name: '765 Cellular',
      account: '****7751',
      type: 'Business'
    },
    {
      id: new Date(2021, 11, 9, 10).toString(),
      name: 'Home Insurance',
      account: '****3666',
      type: 'Business'
    },
    {
      id: new Date(2021, 11, 8, 10).toString(),
      name: 'Mortgage',
      account: '****6565',
      type: 'Business'
    }
  ]
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.payeeId = null;
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.payeeId = null;
      state.error = action.payload;
      state.isLoading = false;
    },

    // CREATE TRANSACTION
    createTransactionSuccess(state, action) {
      const newTransaction = action.payload;
      state.payeeId = null;
      state.transactions = [newTransaction, ...state.transactions];
      state.accounts = map(state.accounts, (_a) => {
        if (_a.type === newTransaction.account)
          return {
            ..._a,
            balance: _a.balance + newTransaction.balance,
            debits: _a.debits + newTransaction.balance
          };
        return _a;
      });
      state.isLoading = false;
    },

    // CREATE PAYEE
    createPayee(state, action) {
      const newPayee = action.payload.payee;
      const section = action.payload.section;
      if (section === 'transfer') state.payees = [newPayee, ...state.payees];
      if (section === 'billpay') state.businessPayees = [newPayee, ...state.businessPayees];
      state.payeeId = newPayee.id;
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function createTransaction(newTransaction: Omit<Transaction, 'id'>) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(
        slice.actions.createTransactionSuccess({
          id: new Date().toString(),
          ...newTransaction
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createPayee(newPayee: Omit<Payee, 'id'>, section: 'transfer' | 'billpay') {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(
        slice.actions.createPayee({
          payee: {
            id: new Date().toString(),
            ...newPayee,
            account: `****${newPayee.account.slice(newPayee.account.length - 4)}`
          },
          section
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
