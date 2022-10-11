import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
// @mui
import { alpha, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// redux
import { useSelector, useDispatch } from '../../redux/store';
import { cleanRespose, SignUp, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import {
  StartStep,
  ContainerForm,
  FormBankCardDetails,
  FormPhoneNumber,
  // FormConfirmationCode,
  FormAccess,
  LastStep
} from '../../sections/auth/SignUp';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectSignUp } from '../../@types/NuDetect';
import { SecurityRequestCall, getPayload } from '../../utils/NuDetect';
import { BeginBehaviouralMonitoring, ClearBehaviouralData } from '../../utils/NuDetectSDK';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: { display: 'flex' }
}));

const SectionStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingTop: theme.spacing(11),
  paddingRight: theme.spacing(1),
  paddingBottom: theme.spacing(13),
  paddingLeft: theme.spacing(1)
}));

const OverlayStyle = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  background: alpha('#000000', 0.7)
}));

// ----------------------------------------------------------------------

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isUpMd = useResponsive('up', 'md');

  const [showOTP, setShowOTP] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);
  const [creditCard, setCreditCard] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { response } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeStep === 1) {
      const session = sessionStorage.getItem('session') || '';
      BeginBehaviouralMonitoring(session, 'SignupWeb');
      dispatch(setHistory('screen', 'Sign Up', 'Sign Up', {}));
    }
    // eslint-disable-next-line
  }, [activeStep]);

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

  const onSignUp = (_data: Partial<NuDetectSignUp>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectSignUp = {
      platform: 'web',
      session,
      payload,
      creditCard,
      phoneNumber,
      username,
      password,
      ...(_data as any)
    };

    dispatch(SignUp(data));
  };

  const onNext = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (response) dispatch(cleanRespose());
  };

  const onBack = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep(0);
    setCreditCard('');
    setPhoneNumber('');
    setUsername('');
    setPassword('');
  };

  const onFinish = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    ClearBehaviouralData();
    dispatch(cleanRespose());
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
      key: 'StartStep',
      component: <StartStep onNext={onNext} />,
      step: 1
    },
    {
      key: 'FormBankCardDetails',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
        >
          <FormBankCardDetails
            ref={refChild}
            onNext={onNext}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            creditCard={creditCard}
            setCreditCard={setCreditCard}
          />
        </ContainerForm>
      ),
      step: 2
    },
    {
      key: 'FormPhoneNumber',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
        >
          <FormPhoneNumber
            ref={refChild}
            onNext={onNext}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </ContainerForm>
      ),
      step: 3
    },
    {
      key: 'FormAccess',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
          isConfirm
        >
          <FormAccess
            ref={refChild}
            // onNext={onNext}
            onNext={() => {}}
            onSignUp={onSignUp}
            creditCard={creditCard}
            phoneNumber={phoneNumber}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 4
    },
    {
      key: 'LastStep',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
          isLast
        >
          <LastStep
            ref={refChild}
            onNext={onFinish}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 6
    }
  ];

  return (
    <Page title="Sign Up">
      <RootStyle>
        <Container maxWidth="xs">
          <ContentStyle>
            {showOTP ? (
              <ConfirmAction
                onBack={() => {
                  if (response) dispatch(cleanRespose());
                  setShowOTP(false);
                }}
                onNext={(OTP?: string) => OTP && onSignUp({ OTP })}
              />
            ) : (
              steps[activeStep].component
            )}
          </ContentStyle>
        </Container>

        {isUpMd && (
          <SectionStyle>
            <OverlayStyle />

            <Image
              src={require('../../assets/illustrations/illustration_signup.png')}
              alt="SignOn"
              sx={{
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </SectionStyle>
        )}
      </RootStyle>
    </Page>
  );
}
