// Function used to get a payload input provided by NDS library
export const getPayload = () => {
  const payload = document.getElementsByName('nds-pmd');

  if (payload.length > 0) return payload[0].getAttribute('value');

  return '';
};

export const SecurityRequestCall = (
  response: any,
  callbackSuccess: () => void,
  callbackOTP: () => void
) => {
  const { interdictionType } = response;
  InterdictionTypeRequestCall(interdictionType, callbackSuccess, callbackOTP);
};

export const ScoreRequestCall = (
  score: number,
  callbackSuccess: () => void,
  callbackOTP: () => void
) => {
  if (score < 100) {
    callbackSuccess();
  } else if (score >= 200) {
    callbackOTP();
  }
};

export const InterdictionTypeRequestCall = (
  interdiction: string,
  callbackSuccess: () => void,
  callbackOTP: () => void
) => {
  if (!['NuCaptcha', 'OTP'].includes(interdiction)) {
    callbackSuccess();
  } else if (interdiction === 'OTP') {
    callbackOTP();
  }
};
