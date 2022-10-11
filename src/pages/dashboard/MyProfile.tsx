import { find } from 'lodash';
import { useState, useRef, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// redux
import { useSelector, useDispatch } from '../../redux/store';
import { cleanRespose, EditProfile, setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
// sections
import {
  ContainerForm,
  PersonalInfo,
  PersonalAndContactInfo,
  ContactInfo
} from '../../sections/@dashboard/MyProfile';
import ConfirmAction from '../../sections/ConfirmAction';
// utils
import { NuDetectEditProfile } from '../../@types/NuDetect';
import { SecurityRequestCall, getPayload } from '../../utils/NuDetect';
import { ClearBehaviouralData } from '../../utils/NuDetectSDK';

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

interface PersonalInfoType {
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}

interface ContactInfoType {
  email: string;
  phoneNumber: string;
}

export default function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOTP, setShowOTP] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, response } = useSelector((state) => state.nuDetectState);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    address1: '507 Netherland Dr.',
    address2: '',
    city: 'Seagoville Tx',
    zipCode: '75159'
  });
  const [newPersonalInfo, setNewPersonalInfo] = useState<PersonalInfoType | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfoType>({
    email: `${user?.username || ''}@mastercard.ca`,
    phoneNumber: user?.phoneNumber || ''
  });
  const [newContactInfo, setNewContactInfo] = useState<ContactInfoType | null>(null);
  const [step, setStep] = useState('PersonalAndContactInfo');
  const [disabledHandleSubmit, setDisabledHandleSubmit] = useState(false);

  const refChild = useRef<{ onHandleSubmit: () => void }>();

  useEffect(() => {
    scroll.scrollToTop({ duration: 0 });
    dispatch(setHistory('screen', 'Edit Profile', 'My Profile', {}));
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

  const onEditProfile = (_data: Partial<NuDetectEditProfile>) => {
    const payload = getPayload();

    const session = sessionStorage.getItem('session') || '';

    const data: NuDetectEditProfile = {
      platform: 'web',
      session,
      payload,
      username: user?.username || '',
      ...(newPersonalInfo && {
        newAddress: newPersonalInfo.address1,
        city: newPersonalInfo.city,
        zipCode: newPersonalInfo.city
      }),
      ...(newContactInfo && {
        ...(contactInfo.email !== newContactInfo.email && {
          oldEmail: contactInfo.email,
          newEmail: newContactInfo.email
        }),
        ...(contactInfo.phoneNumber !== newContactInfo.phoneNumber && {
          newPhone: newContactInfo.phoneNumber
        })
      }),
      ...(_data as any)
    };

    dispatch(EditProfile(data));
  };

  useEffect(() => {
    const _step = find(steps, ({ key }) => key === step);
    if (_step) {
      setActiveStep(_step.step - 1);
    }
    // eslint-disable-next-line
  }, [step]);

  const onStart = () => {
    scroll.scrollToTop({ duration: 0 });
    setDisabledHandleSubmit(false);
    navigate(-1);
  };

  const onNext = () => {
    setOpenDialog(true);
    if (response) dispatch(cleanRespose());
    setTimeout(() => {
      setStep('PersonalAndContactInfo');
      if (step === 'PersonalInfo' && newPersonalInfo) {
        setPersonalInfo(newPersonalInfo);
        setNewPersonalInfo(null);
      }
      if (step === 'ContactInfo' && newContactInfo) {
        setContactInfo(newContactInfo);
        setNewContactInfo(null);
      }
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

  const steps = [
    {
      key: 'PersonalAndContactInfo',
      component: (
        <ContainerForm
          onBack={onStart}
          handleSubmit={handleSubmit}
          step="PersonalAndContactInfo"
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
        >
          <PersonalAndContactInfo
            ref={refChild}
            personalInfo={personalInfo}
            contactInfo={contactInfo}
            setStep={(_step) => setStep(_step)}
          />
        </ContainerForm>
      ),
      step: 1
    },
    {
      key: 'PersonalInfo',
      component: (
        <ContainerForm
          onBack={() => setStep('PersonalAndContactInfo')}
          handleSubmit={handleSubmit}
          step="PersonalInfo"
          openDialog={openDialog}
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter
        >
          <PersonalInfo
            ref={refChild}
            personalInfo={personalInfo}
            setPersonalInfo={setNewPersonalInfo}
            onNext={() => setStep('PersonalAndContactInfo')}
            setStep={() => setStep('PersonalAndContactInfo')}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            onEditProfile={onEditProfile}
          />
        </ContainerForm>
      ),
      step: 2
    },
    {
      key: 'ContactInfo',
      component: (
        <ContainerForm
          onBack={() => setStep('PersonalAndContactInfo')}
          handleSubmit={handleSubmit}
          step="ContactInfo"
          openDialog={openDialog}
          disabledHandleSubmit={disabledHandleSubmit}
          setDisabledHandleSubmit={setDisabledHandleSubmit}
          withFooter
        >
          <ContactInfo
            ref={refChild}
            contactInfo={contactInfo}
            setContactInfo={setNewContactInfo}
            onNext={() => setStep('PersonalAndContactInfo')}
            setStep={() => setStep('PersonalAndContactInfo')}
            setDisabledHandleSubmit={setDisabledHandleSubmit}
            onEditProfile={onEditProfile}
          />
        </ContainerForm>
      ),
      step: 3
    }
  ];

  return (
    <Page title="My Profile">
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
                  onNext={(OTP?: string) => OTP && onEditProfile({ OTP })}
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
