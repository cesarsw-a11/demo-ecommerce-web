export interface NuDetectState {
  isLoading: boolean;
  user: User | null;
  isOpenConsole: boolean;
  webSessionId: string;
  response: any;
  history: any[];
  error: Error | null;
}

export interface User {
  username: string;
  password: string;
  phoneNumber: string;
}

interface NuDetectBase {
  platform: 'web';
  session: string;
  payload: any;
  captcha?: { token: string; answer: string };
  OTP?: string;
}

export interface NuDetectSignIn extends NuDetectBase {
  username: string;
  password: string;
}

export interface NuDetectSignUp extends NuDetectBase {
  creditCard: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export interface NuDetectApplyCredit extends NuDetectBase {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface NuDetectEditProfile extends NuDetectBase {
  username: string;
  newPhone?: string;
  newAddress?: string;
  city?: string;
  zipCode?: string;
  oldEmail?: string;
  newEmail?: string;
}

export interface NuDetectPayee extends NuDetectBase {
  username: string;
  accountType: 'PERSONAL' | 'BUSINESS';
  firstName: string;
  accountNumber: string;
  zipCode: string;
}

export interface SourceAccount {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
}

export interface DestinationAccount extends SourceAccount {
  accountType: 'PERSONAL' | 'BUSINESS';
}

export interface NuDetectTransfer extends NuDetectBase {
  username: string;
  phoneNumber: string;
  amount: string;
  sourceAccount: SourceAccount;
  destinationAccount: DestinationAccount;
}

export interface NuDetectBillPay extends NuDetectBase {
  username: string;
  phoneNumber: string;
  amount: string;
  sourceAccount: SourceAccount;
  destinationAccount: DestinationAccount;
}

export interface NuDetectForgotPassword extends NuDetectBase {
  username: string;
  newPassword: string;
}

export interface NuDetectChangePassword extends NuDetectBase {
  username: string;
  oldPassword: string;
  newPassword: string;
}
