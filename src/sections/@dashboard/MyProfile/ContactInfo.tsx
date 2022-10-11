import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Divider, Typography, FormControl, TextField } from '@mui/material';
// components
import { IconButtonAnimate } from '../../../components/animate';
// redux
import { useSelector } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
// types
import { NuDetectEditProfile } from '../../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../../sections/Captcha';
import { BeginBehaviouralMonitoring, ClearBehaviouralData } from '../../../utils/NuDetectSDK';

// ----------------------------------------------------------------------

const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[900]
    }
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginRight: 0
  }
}));

// ----------------------------------------------------------------------

type MaskProps = {
  onChange: (event: { target: { name: string; value: string; maxLength?: number } }) => void;
  name: string;
};

// ----------------------------------------------------------------------

const PhoneNumberMask = forwardRef<HTMLElement, MaskProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      prefix=""
      isNumericString
      format="(###) ### ####"
    />
  );
});

// ----------------------------------------------------------------------

interface ContactInfo {
  email: string;
  phoneNumber: string;
}

interface InitialValuesForm extends ContactInfo {
  afterSubmit?: string;
}

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setStep,
      contactInfo,
      setContactInfo,
      setDisabledHandleSubmit,
      onEditProfile
    }: {
      onNext: () => void;
      setStep: () => void;
      contactInfo: ContactInfo;
      setContactInfo: (_v: ContactInfo) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      onEditProfile: (_v: Partial<NuDetectEditProfile>) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      const session = sessionStorage.getItem('session') || '';
      BeginBehaviouralMonitoring(session, 'EditProfileWeb');
    }, []);

    useEffect(
      () => () => ClearBehaviouralData(),
      // eslint-disable-next-line
      []
    );

    const { response } = useSelector((state) => state.nuDetectState);

    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .required('Email address is required')
        .email('Enter a valid email address'),
      phoneNumber: Yup.string()
        .required('Enter a 10 digit number')
        .min(10, 'Enter a 10 digit number')
    });

    const formik = useFormik<InitialValuesForm>({
      validateOnMount: true,
      initialValues: {
        email: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber
      },
      validationSchema,
      onSubmit: async (values) => {
        setContactInfo(values);

        const captcha = getCaptchaValues();

        onEditProfile({
          ...(contactInfo.email !== values.email && {
            oldEmail: contactInfo.email,
            newEmail: values.email
          }),
          ...(contactInfo.phoneNumber !== values.phoneNumber && {
            newPhone: values.phoneNumber
          }),
          ...(captcha && { captcha })
        });
      }
    });

    const { handleSubmit, getFieldProps, touched, errors } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    return (
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack direction="row" alignItems="center">
            <IconButtonAnimate onClick={setStep} sx={{ mr: 1, color: 'text.primary' }}>
              <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
                {getIcon('ic_back')}
              </Box>
            </IconButtonAnimate>

            <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
              Contact info
            </Typography>
          </Stack>

          <Divider sx={{ mt: 1, mb: 5 }} />

          <Stack spacing={3}>
            <FormControl>
              <Typography
                variant="body1"
                fontWeight={300}
                color={(theme) => theme.palette.grey[900]}
                mb={1}
              >
                Email
              </Typography>

              <CssTextField
                {...getFieldProps('email')}
                id="email"
                fullWidth
                placeholder="ENTER YOUR EMAIL"
                color="secondary"
                size="small"
                InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </FormControl>

            <FormControl>
              <Typography
                variant="body1"
                fontWeight={300}
                color={(theme) => theme.palette.grey[900]}
                mb={1}
              >
                Phone number
              </Typography>

              <CssTextField
                {...getFieldProps('phoneNumber')}
                id="phoneNumber"
                fullWidth
                placeholder="(505) 555 1212"
                color="secondary"
                size="small"
                InputProps={{
                  inputComponent: PhoneNumberMask as any,
                  sx: { fontFamily: 'Roboto', fontWeight: 800 }
                }}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </FormControl>

            {response && response.hasCaptcha && <Captcha captcha={response.captcha} />}
          </Stack>
        </Form>
      </FormikProvider>
    );
  }
);
