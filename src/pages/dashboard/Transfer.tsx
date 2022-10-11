import { useState, useRef, useEffect } from 'react';
import { find, max } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
// @mui
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useSelector, useDispatch } from '../../redux/store';
import { createTransaction } from '../../redux/slices/account';
import { cleanRespose, Transfer, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
// sections
import {
  ContainerForm,
  TransferTo,
  Amount,
  SelectAnAccount
} from '../../sections/@dashboard/Transfer';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectTransfer } from '../../@types/NuDetect';
import { SecurityRequestCall, getPayload } from '../../utils/NuDetect';
import { BeginBehaviouralMonitoring, ClearBehaviouralData } from '../../utils/NuDetectSDK';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: { display: 'flex' }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
}));

// ----------------------------------------------------------------------

export default function TransferPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isUpSm = useResponsive('up', 'sm');
  const { state } = useLocation();

  const [showOTP, setShowOTP] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);
  const [payee, setPayee] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState('');
  const [card, setCard] = useState<string | null>(null);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { payees, accounts, payeeId } = useSelector((state) => state.accountState);

  const getPayee = () => find(payees, ({ id }) => id === payee);

  const getAccount = () => find(accounts, ({ id }) => id === card);

  const { user, response } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    if (state && (state as any).payee) {
      if (payeeId && find(payees, ({ id }) => id === payeeId)) {
        setPayee(payeeId);
        onNext();
      }
    }
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'SendTransferWeb');
    dispatch(setHistory('screen', 'Transfer', 'Make a Transfer', {}));
    // eslint-disable-next-line
  }, []);

  useEffect(
    () => () => {
      ClearBehaviouralData();
      dispatch(cleanRespose());
    },
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (response) {
      SecurityRequestCall(
        response,
        () => {
          setShowOTP(false);
          onNext();
        },
        () => setShowOTP(true)
      );
    }
    // eslint-disable-next-line
  }, [response]);

  useEffect(() => () => ClearBehaviouralData(), []);

  const onTransfer = (_data: Partial<NuDetectTransfer>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectTransfer = {
      platform: 'web',
      session,
      payload,
      username: user?.username || '',
      phoneNumber: user?.phoneNumber || '',
      amount: amount.toString(),
      sourceAccount: {
        accountNumber: getAccount()?.number || '',
        accountHolder: getAccount()?.type || '',
        bankName: 'Mastercard'
      },
      destinationAccount: {
        accountNumber: getPayee()?.account || '',
        accountHolder: getPayee()?.name || '',
        bankName: 'Mastercard',
        accountType: (getPayee()?.type || '').toUpperCase()
      },
      ...(_data as any)
    };

    dispatch(Transfer(data));
  };

  const onStart = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    navigate('/app', { replace: true });
  };

  const onNext = () => {
    scroll.scrollToTop({ duration: 0 });
    if (response) {
      dispatch(cleanRespose());
      dispatch(
        createTransaction({
          name: `Transfer to ${getPayee()?.name || ''}`,
          balance: -Number(amount),
          date: new Date(),
          reference: remark,
          account: getAccount()?.type || 'saving'
        })
      );
    }
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onBack = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    navigate('/app', { replace: true });
  };

  const handleSubmit = () => {
    const { current } = refChild;
    if (current) {
      const { onHandleSubmit } = current;
      if (onHandleSubmit) onHandleSubmit();
      else onNext();
    } else onNext();
  };

  const steps = [
    {
      key: 'TransferTo',
      component: (
        <ContainerForm
          onBack={onStart}
          handleSubmit={handleSubmit}
          step="TransferTo"
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
        >
          <TransferTo
            ref={refChild}
            onNext={onNext}
            payee={payee}
            setPayee={setPayee}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 1
    },
    {
      key: 'Amount',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          step="Amount"
          payee={payee}
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter
        >
          <Amount
            ref={refChild}
            onNext={onNext}
            amount={amount}
            setAmount={setAmount}
            remark={remark}
            setRemark={setRemark}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            maxAmount={max(accounts.map(({ balance }) => balance)) || 0}
          />
        </ContainerForm>
      ),
      step: 2
    },
    {
      key: 'SelectAnAccount',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          step="SelectAnAccount"
          payee={payee}
          amount={amount}
          remark={remark}
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter={response && response.hasCaptcha}
        >
          <SelectAnAccount
            ref={refChild}
            onNext={onNext}
            card={card}
            setCard={setCard}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            amount={amount}
            onTransfer={onTransfer}
          />
        </ContainerForm>
      ),
      step: 3
    },
    {
      key: 'LastStep',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          step="LastStep"
          payee={payee}
          amount={amount}
          remark={remark}
          card={card}
          disabledHandleSubmit={true}
          setDisabledHandleSubmit={() => {}}
          withFooter
          isLast
        >
          <></>
        </ContainerForm>
      ),
      step: 4
    }
  ];

  return (
    <Page title="Transfer">
      <RootStyle>
        <Container maxWidth="lg">
          <ContentStyle>
            {showOTP ? (
              <ContainerForm
                onBack={() => {}}
                handleSubmit={() => {}}
                step=""
                disabledHandleSubmit={false}
                setDisabledHandleSubmit={() => {}}
                isOTP
              >
                <ConfirmAction
                  onBack={() => {
                    if (response) dispatch(cleanRespose());
                    setShowOTP(false);
                  }}
                  onNext={(OTP?: string) => OTP && onTransfer({ OTP })}
                />
              </ContainerForm>
            ) : (
              <form>{steps[activeStep].component}</form>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
