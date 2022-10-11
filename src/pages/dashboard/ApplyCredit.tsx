import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
// @mui
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { cleanRespose, ApplyCredit, setHistory } from '../../redux/slices/NuDetect';
import { useSelector, useDispatch } from '../../redux/store';
// components
import Page from '../../components/Page';
// sections
import { ContainerForm } from '../../sections/@dashboard/ApplyCredit';
import {
  FormAboutYou,
  FormYourIncome,
  FormContactingYou,
  LastStep
} from '../../sections/ApplyCredit';
import ConfirmAction from '../../sections/ConfirmAction';
import { NuDetectApplyCredit } from '../../@types/NuDetect';
import { SecurityRequestCall, getPayload } from '../../utils/NuDetect';
import { BeginBehaviouralMonitoring, ClearBehaviouralData } from '../../utils/NuDetectSDK';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: { display: 'flex' }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  // paddingTop: theme.spacing(11),
  paddingRight: theme.spacing(1),
  // paddingBottom: theme.spacing(13),
  paddingLeft: theme.spacing(1)
}));

// ----------------------------------------------------------------------

interface AboutYou {
  firstName: string;
  middleInitial: string;
  lastName: string;
  dateOfBirth: {
    mm: string;
    dd: string;
    yyyy: string;
  };
  citizenship: string;
  last4DigitalOfSocialSecurityNumber: string;
}

interface ContactingYou {
  email: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}

export default function ApplyCreditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOTP, setShowOTP] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [aboutYou, setAboutYou] = useState<AboutYou | null>(null);
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);
  const [contactingYou, setContactingYou] = useState<ContactingYou | null>(null);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  const { response } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    const session = sessionStorage.getItem('session') || '';
    BeginBehaviouralMonitoring(session, 'ApplyCreditCardWeb');
    dispatch(setHistory('screen', 'Apply Credit', 'Apply Credit Card', {}));
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

  const onApplyCredit = (_data: Partial<NuDetectApplyCredit>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectApplyCredit = {
      platform: 'web',
      session,
      payload,
      firstName: aboutYou?.firstName || '',
      lastName: aboutYou?.lastName || '',
      dateOfBirth: `${aboutYou?.dateOfBirth.mm || ''}-${aboutYou?.dateOfBirth.dd || ''}-${
        aboutYou?.dateOfBirth.yyyy || ''
      }`,
      emailAddress: contactingYou?.email || '',
      phoneNumber: contactingYou?.phoneNumber || '',
      streetAddress: contactingYou?.address1 || '',
      city: contactingYou?.city || '',
      zipCode: contactingYou?.zipCode || '',
      ...(_data as any)
    };

    dispatch(ApplyCredit(data));
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
    navigate('/app/products', { replace: true });
  };

  const onFinish = () => {
    scroll.scrollToTop({ duration: 0 });
    dispatch(cleanRespose());
    ClearBehaviouralData();
    setDisabledHandleSubmit(false);
    navigate('/app/products', { replace: true });
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
      key: 'FormBankAboutYou',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
        >
          <FormAboutYou
            ref={refChild}
            onNext={onNext}
            aboutYou={aboutYou}
            setAboutYou={setAboutYou}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 1
    },
    {
      key: 'FormYourIncome',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
        >
          <FormYourIncome
            ref={refChild}
            onNext={onNext}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
          />
        </ContainerForm>
      ),
      step: 2
    },
    {
      key: 'FormContactingYou',
      component: (
        <ContainerForm
          onBack={onBack}
          handleSubmit={handleSubmit}
          disabledHandleSubmit={disabledHandleSubmit}
          isConfirm
        >
          <FormContactingYou
            ref={refChild}
            onNext={onNext}
            aboutYou={aboutYou}
            contactingYou={contactingYou}
            setContactingYou={setContactingYou}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            onApplyCredit={onApplyCredit}
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
      step: 4
    }
  ];

  return (
    <Page title="Apply for a Credit Card">
      <RootStyle>
        <Container maxWidth="lg">
          <ContentStyle>
            {showOTP ? (
              <ContainerForm>
                <ConfirmAction
                  onBack={() => {
                    if (response) dispatch(cleanRespose());
                    setShowOTP(false);
                  }}
                  onNext={(OTP?: string) => OTP && onApplyCredit({ OTP })}
                />
              </ContainerForm>
            ) : (
              steps[activeStep].component
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
