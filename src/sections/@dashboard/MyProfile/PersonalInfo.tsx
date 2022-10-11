import * as Yup from 'yup';
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

interface PersonalInfo {
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}

interface InitialValuesForm extends PersonalInfo {
  afterSubmit?: string;
}

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setStep,
      personalInfo,
      setPersonalInfo,
      setDisabledHandleSubmit,
      onEditProfile
    }: {
      onNext: () => void;
      setStep: () => void;
      personalInfo: PersonalInfo;
      setPersonalInfo: (_v: PersonalInfo) => void;
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
      address1: Yup.string().required('Street address is required'),
      // address2: Yup.string().required('This field is required'),
      city: Yup.string().required('City is required'),
      zipCode: Yup.string().required('Zip Code is required')
    });

    const formik = useFormik<InitialValuesForm>({
      validateOnMount: true,
      initialValues: {
        address1: personalInfo.address1,
        address2: personalInfo.address2,
        city: personalInfo.city,
        zipCode: personalInfo.zipCode
      },
      validationSchema,
      onSubmit: async (values) => {
        setPersonalInfo(values);

        const captcha = getCaptchaValues();

        onEditProfile({
          newAddress: values.address1,
          city: values.city,
          zipCode: values.city,
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
              Personal info
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
                Street address
              </Typography>

              <CssTextField
                {...getFieldProps('address1')}
                id="address1"
                fullWidth
                placeholder=""
                color="secondary"
                size="small"
                InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                error={Boolean(touched.address1 && errors.address1)}
                helperText={touched.address1 && errors.address1}
              />

              <CssTextField
                {...getFieldProps('address2')}
                id="address2"
                fullWidth
                placeholder="APARTMENT, SUITE, UNIT, FLOOR, ETC."
                color="secondary"
                size="small"
                sx={{ mt: 2 }}
                InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                error={Boolean(touched.address2 && errors.address2)}
                helperText={touched.address2 && errors.address2}
              />
            </FormControl>

            <FormControl>
              <Typography
                variant="body1"
                fontWeight={300}
                color={(theme) => theme.palette.grey[900]}
                mb={1}
              >
                City
              </Typography>

              <CssTextField
                {...getFieldProps('city')}
                id="city"
                fullWidth
                placeholder="NEW YORK"
                color="secondary"
                size="small"
                InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
              />
            </FormControl>

            <FormControl>
              <Typography
                variant="body1"
                fontWeight={300}
                color={(theme) => theme.palette.grey[900]}
                mb={1}
              >
                Zip Code
              </Typography>

              <CssTextField
                {...getFieldProps('zipCode')}
                id="zipCode"
                fullWidth
                placeholder="00000"
                color="secondary"
                size="small"
                InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                error={Boolean(touched.zipCode && errors.zipCode)}
                helperText={touched.zipCode && errors.zipCode}
              />
            </FormControl>

            {response && response.hasCaptcha && <Captcha captcha={response.captcha} />}
          </Stack>
        </Form>
      </FormikProvider>
    );
  }
);
