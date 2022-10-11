import { format } from 'date-fns';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import {
  NuDetectState,
  NuDetectSignIn,
  NuDetectSignUp,
  NuDetectApplyCredit,
  NuDetectEditProfile,
  NuDetectPayee,
  NuDetectTransfer,
  NuDetectBillPay,
  NuDetectForgotPassword,
  NuDetectChangePassword
} from '../../@types/NuDetect';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState: NuDetectState = {
  isLoading: false,
  user: null,
  isOpenConsole: false,
  webSessionId: '',
  response: null,
  history: [],
  error: null
};

const slice = createSlice({
  name: 'NuDetect',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.error = null;
      state.response = null;
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      const error = action.payload;

      if (error.response) state.webSessionId = error.response.webSessionId;

      state.response = null;
      state.error = error;
      state.isLoading = false;
    },

    cleanRespose(state) {
      state.response = null;
      state.error = null;
    },

    cleanUser(state) {
      state.user = null;
      state.error = null;
    },

    openConsole(state, action) {
      if (state.history.length > 0) state.isOpenConsole = action.payload;
    },

    setHistory(state, action) {
      state.history = [...state.history, action.payload];
    },

    SignInSuccess(state, action) {
      state.error = null;
      state.user = action.payload.user;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    SignUpSuccess(state, action) {
      state.error = null;
      state.user = action.payload.user;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    ApplyCreditSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    EditProfileSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    PayeeSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    TransferSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    BillPaySuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    ForgotPasswordSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    },

    ChangePasswordSuccess(state, action) {
      state.error = null;
      state.webSessionId = action.payload.webSessionId;
      state.response = action.payload;
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function cleanUser() {
  return async () => dispatch(slice.actions.cleanUser());
}

// ----------------------------------------------------------------------

export function cleanRespose() {
  return async () => dispatch(slice.actions.cleanRespose());
}

// ----------------------------------------------------------------------

export function openConsole(open: boolean) {
  return async () => dispatch(slice.actions.openConsole(open));
}

export function setHistory(type: string, endpoint: string, placement: string, data: any) {
  return async () =>
    dispatch(
      slice.actions.setHistory({
        type,
        datetime: format(new Date(), 'eee, dd LLL yyyy HH:mm:ss'),
        endpoint,
        placement,
        ...data
      })
    );
}

// ----------------------------------------------------------------------

export function SignIn(data: NuDetectSignIn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/auth/sign-in', 'LoginWeb', { request: data }));

      const response = await axios.post('/auth/sign-in', data);

      dispatch(setHistory('success', '/auth/sign-in', 'LoginWeb', { success: response.data }));

      dispatch(slice.actions.SignInSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/auth/sign-in', 'LoginWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function SignUp(data: NuDetectSignUp) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/auth/sign-up', 'SignupWeb', { request: data }));

      const response = await axios.post('/auth/sign-up', data);

      dispatch(setHistory('success', '/auth/sign-up', 'SignupWeb', { success: response.data }));

      dispatch(slice.actions.SignUpSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/auth/sign-up', 'SignupWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function ApplyCredit(data: NuDetectApplyCredit) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/apply-credit', 'ApplyCreditCardWeb', { request: data }));

      const response = await axios.post('/apply-credit', data);

      dispatch(
        setHistory('success', '/apply-credit', 'ApplyCreditCardWeb', { success: response.data })
      );

      dispatch(slice.actions.ApplyCreditSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/apply-credit', 'ApplyCreditCardWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function EditProfile(data: NuDetectEditProfile) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/user/edit-profile', 'EditProfileWeb', { request: data }));

      const response = await axios.post('/user/edit-profile', data);

      dispatch(
        setHistory('success', '/user/edit-profile', 'EditProfileWeb', { success: response.data })
      );

      dispatch(slice.actions.EditProfileSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/user/edit-profile', 'EditProfileWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function Payee(data: NuDetectPayee) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/payee', 'AddNewPayeeWeb', { request: data }));

      const response = await axios.post('/payee', data);

      dispatch(setHistory('success', '/payee', 'AddNewPayeeWeb', { success: response.data }));

      dispatch(slice.actions.PayeeSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/payee', 'AddNewPayeeWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function Transfer(data: NuDetectTransfer) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/transfer', 'SendTransferWeb', { request: data }));

      const response = await axios.post('/transfer', data);

      dispatch(setHistory('success', '/transfer', 'SendTransferWeb', { success: response.data }));

      dispatch(slice.actions.TransferSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/transfer', 'SendTransferWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function BillPay(data: NuDetectBillPay) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setHistory('request', '/bill-pay', 'PayBillWeb', { request: data }));

      const response = await axios.post('/bill-pay', data);

      dispatch(setHistory('success', '/bill-pay', 'PayBillWeb', { success: response.data }));

      dispatch(slice.actions.BillPaySuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/bill-pay', 'PayBillWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function ForgotPassword(data: NuDetectForgotPassword) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(
        setHistory('request', '/auth/forgot-password', 'PasswordResetWeb', { request: data })
      );

      const response = await axios.post('/auth/forgot-password', data);

      dispatch(
        setHistory('success', '/auth/forgot-password', 'PasswordResetWeb', {
          success: response.data
        })
      );

      dispatch(slice.actions.ForgotPasswordSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/auth/forgot-password', 'PasswordResetWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function ChangePassword(data: NuDetectChangePassword) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(
        setHistory('request', '/auth/forgot-password', 'PasswordResetWeb', { request: data })
      );

      const response = await axios.post('/user/password-reset', data);

      dispatch(
        setHistory('success', '/auth/forgot-password', 'PasswordResetWeb', {
          success: response.data
        })
      );

      dispatch(slice.actions.ChangePasswordSuccess(response.data));
    } catch (error) {
      dispatch(setHistory('error', '/auth/forgot-password', 'PasswordResetWeb', { error }));

      dispatch(slice.actions.hasError(error));
    }
  };
}
