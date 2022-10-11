import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useSelector } from '../../redux/store';
// types
import { NuDetectApplyCredit } from '../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../sections/Captcha';
import { BindNewFields } from '../../utils/NuDetectSDK';

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

interface InitialValuesFormContactingYou extends ContactingYou {
  afterSubmit?: string;
}

export default forwardRef(
  (
    {
      onNext,
      aboutYou,
      contactingYou,
      setContactingYou,
      setDisabledHandleSubmit,
      onApplyCredit
    }: {
      onNext: () => void;
      aboutYou: AboutYou | null;
      contactingYou: ContactingYou | null;
      setContactingYou: (_v: ContactingYou) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      onApplyCredit: (_v: Partial<NuDetectApplyCredit>) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const { response } = useSelector((state) => state.nuDetectState);

    const Schema = Yup.object().shape({
      email: Yup.string()
        .required('Email address is required')
        .email('Enter a valid email address'),
      phoneNumber: Yup.string()
        .required('Enter a 10 digit number')
        .min(10, 'Enter a 10 digit number'),
      address1: Yup.string().required('Street address is required'),
      // address2: Yup.string().required('This field is required'),
      city: Yup.string().required('City is required'),
      zipCode: Yup.string().required('Zip Code is required')
    });

    const formik = useFormik<InitialValuesFormContactingYou>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        email: contactingYou?.email || '',
        phoneNumber: contactingYou?.phoneNumber || '',
        address1: contactingYou?.address1 || '',
        address2: contactingYou?.address2 || '',
        city: contactingYou?.city || '',
        zipCode: contactingYou?.zipCode || ''
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setContactingYou({
          email: values.email,
          phoneNumber: values.phoneNumber,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          zipCode: values.zipCode
        });

        const captcha = getCaptchaValues();

        onApplyCredit({
          firstName: aboutYou?.firstName || '',
          lastName: aboutYou?.lastName || '',
          dateOfBirth: `${aboutYou?.dateOfBirth.mm || ''}-${aboutYou?.dateOfBirth.dd || ''}-${
            aboutYou?.dateOfBirth.yyyy || ''
          }`,
          emailAddress: values.email,
          phoneNumber: values.phoneNumber,
          streetAddress: values.address1,
          city: values.city,
          zipCode: values.zipCode,
          ...(captcha && { captcha })
        });
      }
    });

    const { handleSubmit, getFieldProps, dirty, touched, errors } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      if (contactingYou) setDisabledHandleSubmit(true);
      else setDisabledHandleSubmit(dirty);
      // eslint-disable-next-line
    }, [contactingYou, dirty]);

    return (
      <Box>
        <Typography
          variant="subtitle2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          CONTACTING YOU
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          3 / 3
        </Typography>

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Email address
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

                <Typography
                  variant="caption"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[700]}
                  lineHeight={1.2}
                  mt={1}
                >
                  We'll email our decision to you, but we won't use this to contact you about
                  anything else.
                </Typography>
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
      </Box>
    );
  }
);
