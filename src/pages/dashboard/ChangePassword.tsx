import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// redux
import { useSelector, useDispatch } from '../../redux/store';
import { cleanRespose, ChangePassword, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
// sections
import { ContainerForm, ChangePasswordForm } from '../../sections/@dashboard/ChangePassword';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectChangePassword } from '../../@types/NuDetect';
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

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOTP, setShowOTP] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { user, response } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'PasswordResetWeb');
    dispatch(setHistory('screen', 'Change Password', 'Change Password', {}));
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

  const onChangePassword = (_data: Partial<NuDetectChangePassword>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectChangePassword = {
      platform: 'web',
      session,
      payload,
      username: user?.username || '',
      oldPassword,
      newPassword,
      ...(_data as any)
    };

    dispatch(ChangePassword(data));
  };

  const onNext = () => {
    setOpenDialog(true);
    if (response) dispatch(cleanRespose());
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setOpenDialog(false);
    }, 2000);
  };

  const handleSubmit = () => {
    const { current } = refChild;
    if (current) {
      const { onHandleSubmit } = current;
      if (onHandleSubmit) onHandleSubmit();
      else onNext();
    } else onNext();
  };

  const onBack = () => {
    scroll.scrollToTop({ duration: 0 });
    navigate(-1);
  };

  return (
    <Page title="Change Password">
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
                  onNext={(OTP?: string) => OTP && onChangePassword({ OTP })}
                />
              </ContainerForm>
            ) : (
              <form>
                <ContainerForm
                  onBack={onBack}
                  handleSubmit={handleSubmit}
                  step="ContactInfo"
                  openDialog={openDialog}
                  disabledHandleSubmit={disabledHandleSubmit}
                  setDisabledHandleSubmit={setDisabledHandleSubmit}
                  withFooter
                >
                  <ChangePasswordForm
                    ref={refChild}
                    onNext={() => {}}
                    setStep={() => {}}
                    setDisabledHandleSubmit={setDisabledHandleSubmit}
                    oldPassword={oldPassword}
                    setOldPassword={setOldPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    onChangePassword={onChangePassword}
                  />
                </ContainerForm>
              </form>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
