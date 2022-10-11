import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha, Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// redux
import { useSelector, useDispatch } from '../../redux/store';
import { cleanRespose, SignIn, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { Form } from '../../sections/auth/SignIn';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectSignIn } from '../../@types/NuDetect';
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
  padding: theme.spacing(10, 0)
  // [theme.breakpoints.up('sm')]: { padding: 0 }
}));

const OverlayStyle = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  background: alpha('#000000', 0.7)
}));

const Dot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(1),
  minWidth: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%'
}));

// ----------------------------------------------------------------------

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isUpMd = useResponsive('up', 'md');

  const [showOTP, setShowOTP] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { response } = useSelector((state) => state.nuDetectState);

  const onNext = () => {
    dispatch(cleanRespose());
    ClearBehaviouralData();
    navigate('/app', { replace: true });
  };

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

  const onSignIn = (_data: Partial<NuDetectSignIn>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectSignIn = {
      platform: 'web',
      session,
      payload,
      username,
      password,
      ...(_data as any)
    };

    dispatch(SignIn(data));
  };

  useEffect(() => {
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'LoginWeb');
    dispatch(setHistory('screen', 'Sign In', 'Login', {}));
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

  return (
    <Page title="Sign In">
      <RootStyle>
        <Container maxWidth="xs">
          <ContentStyle>
            {showOTP ? (
              <ConfirmAction
                onBack={() => {
                  if (response) dispatch(cleanRespose());
                  setShowOTP(false);
                }}
                onNext={(OTP?: string) => OTP && onSignIn({ OTP })}
              />
            ) : (
              <>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  mb={{ xs: 10, sm: 15 }}
                >
                  <Image src={require('../../assets/logo.png')} alt="Logo" />
                </Stack>

                <Form
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  onSignIn={onSignIn}
                />

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  position={{ xs: 'fixed', sm: 'relative' }}
                  bottom={{ xs: 0, sm: 'unset' }}
                  left={{ xs: 0, sm: 'unset' }}
                  width={{ xs: '100%', sm: 'unset' }}
                  height={{ xs: 66, sm: 'unset' }}
                  px={{ xs: 1, sm: 'unset' }}
                  bgcolor={(theme) => ({ xs: theme.palette.common.white, sm: 'unset' })}
                >
                  <Typography
                    variant="caption"
                    fontFamily="Roboto"
                    fontWeight={800}
                    color={(theme) => theme.palette.grey[500]}
                  >
                    LOCATIONS
                  </Typography>

                  <Dot />

                  <Typography
                    variant="caption"
                    fontFamily="Roboto"
                    fontWeight={800}
                    color={(theme) => theme.palette.grey[500]}
                  >
                    HELP
                  </Typography>

                  <Dot />

                  <Typography
                    variant="caption"
                    fontFamily="Roboto"
                    fontWeight={800}
                    color={(theme) => theme.palette.grey[500]}
                  >
                    CONTACTS US
                  </Typography>

                  <Dot />

                  <Typography
                    variant="caption"
                    fontFamily="Roboto"
                    fontWeight={800}
                    color={(theme) => theme.palette.grey[500]}
                  >
                    PRIVACY POLICY
                  </Typography>
                </Stack>
              </>
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
