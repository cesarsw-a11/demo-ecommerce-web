import { useState, useRef, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { createPayee } from '../../redux/slices/account';
import { cleanRespose, Payee, setHistory } from '../../redux/slices/NuDetect';
import { useSelector, useDispatch } from '../../redux/store';
// components
import Page from '../../components/Page';
// sections
import {
  ContainerForm,
  AddNewPayee,
  ConfirmPayeeToAdd,
  LastStep
} from '../../sections/@dashboard/Payee';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectPayee } from '../../@types/NuDetect';
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

export default function PayeePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [showOTP, setShowOTP] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);
  const [payee, setPayee] = useState<{
    type: 'PERSONAL' | 'BUSINESS';
    name: string;
    account: string;
    zipCode: string;
  } | null>(null);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { user, response } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'AddNewPayeeWeb');
    dispatch(setHistory('screen', 'Payee', 'Add New Payee', {}));
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

  const onPayee = (_data: Partial<NuDetectPayee>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectPayee = {
      platform: 'web',
      session,
      payload,
      username: user?.username || '',
      accountType: payee?.type || 'PERSONAL',
      firstName: payee?.name || '',
      accountNumber: payee?.account || '',
      zipCode: payee?.zipCode || '',
      ...(_data as any)
    };

    dispatch(Payee(data));
  };

  const onStart = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    if (state && (state as any).route)
      navigate((state as any).route, { replace: true, state: { payee } });
  };

  const onNext = () => {
    if (response) dispatch(cleanRespose());
    if (payee) dispatch(createPayee(payee, state ? (state as any).section : 'transfer'));
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onBack = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      key: 'AddNewPayee',
      component: (
        <ContainerForm
          onBack={onStart}
          handleSubmit={handleSubmit}
          step="AddNewPayee"
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter
        >
          <AddNewPayee
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
      key: 'ConfirmPayeeToAdd',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          step="ConfirmPayeeToAdd"
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter
        >
          <ConfirmPayeeToAdd
            ref={refChild}
            onNext={onNext}
            onBack={onBack}
            payee={payee}
            section={state ? (state as any).section : 'transfer'}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            onPayee={onPayee}
          />
        </ContainerForm>
      ),
      step: 2
    },
    {
      key: 'LastStep',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          step="LastStep"
          disabledHandleSubmit={true}
          setDisabledHandleSubmit={() => {}}
          withFooter
          isLast
        >
          <LastStep
            ref={refChild}
            onNext={onStart}
            onBack={onBack}
            payee={payee}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 4
    }
  ];

  return (
    <Page title="Payee">
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
                  onNext={(OTP?: string) => OTP && onPayee({ OTP })}
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
