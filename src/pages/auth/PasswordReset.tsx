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
import { cleanRespose, ForgotPassword, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import {
  StartStep,
  ContainerForm,
  SentYouInstructions,
  FormChangePassword,
  LastStep
} from '../../sections/auth/PasswordReset';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectForgotPassword } from '../../@types/NuDetect';
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

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isUpMd = useResponsive('up', 'md');

  const [username, setUsername] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { response, error } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'PasswordResetWeb');
    dispatch(setHistory('screen', 'Forgot Password', 'Forgot Password', {}));
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
    if (error) {
      if ((error as any).status === 404) navigate(0);
    }
    // eslint-disable-next-line
  }, [error]);

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

  const onForgotPassword = (_data: Partial<NuDetectForgotPassword>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectForgotPassword = {
      platform: 'web',
      session,
      payload,
      username,
      newPassword,
      ...(_data as any)
    };

    dispatch(ForgotPassword(data));
  };

  const onNext = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onBack = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onFinish = () => {
    scroll.scrollToTop({ duration: 0 });
    dispatch(cleanRespose());
    setDisabledHandleSubmit(false);
    ClearBehaviouralData();
    navigate('/signin', { replace: true });
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
      component: <StartStep onNext={onNext} username={username} setUsername={setUsername} />,
      step: 1
    },
    {
      key: 'SentYouInstructions',
      component: <SentYouInstructions ref={refChild} onNext={onNext} />,
      step: 2
    },
    {
      key: 'FormChangePassword',
      component: (
        <ContainerForm
          isConfirm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
        >
          <FormChangePassword
            ref={refChild}
            onNext={onNext}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onForgotPassword={onForgotPassword}
          />
        </ContainerForm>
      ),
      step: 3
    },
    {
      key: 'LastStep',
      component: <LastStep ref={refChild} onNext={onFinish} />,
      step: 4
    }
  ];

  return (
    <Page title="Password Reset">
      <RootStyle>
        <Container maxWidth="xs">
          <ContentStyle>
            {showOTP ? (
              <ConfirmAction
                onBack={() => {
                  if (response) dispatch(cleanRespose());
                  setShowOTP(false);
                }}
                onNext={(OTP?: string) => OTP && onForgotPassword({ OTP })}
              />
            ) : (
              <form>{steps[activeStep].component}</form>
            )}
          </ContentStyle>
        </Container>

        {isUpMd && (
          <SectionStyle>
            <OverlayStyle />

            <Image
              src={require('../../assets/illustrations/illustration_signin.png')}
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
