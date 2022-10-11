import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useState, useEffect, forwardRef, useImperativeHandle, MouseEvent } from 'react';
// @mui
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useSelector } from '../../../redux/store';
// types
import { NuDetectSignUp } from '../../../@types/NuDetect';
// components
import Image from '../../../components/Image';
//
import IcEyeOpen from '../../../assets/icons/ic_eye_open.svg';
import IcEyeClose from '../../../assets/icons/ic_eye_close.svg';
// utils
import Captcha, { getCaptchaValues } from '../../../sections/Captcha';
import { BindNewFields } from '../../../utils/NuDetectSDK';

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

type InitialValuesFormAccess = {
  username: string;
  password: string;
  confirmPassword: string;
  afterSubmit?: string;
};

export default forwardRef(
  (
    {
      onNext,
      creditCard,
      phoneNumber,
      username,
      setUsername,
      password,
      setPassword,
      setDisabledHandleSubmit,
      onSignUp
    }: {
      onNext: () => void;
      creditCard: string;
      phoneNumber: string;
      username: string;
      setUsername: (_v: string) => void;
      password: string;
      setPassword: (_v: string) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      onSignUp: (_v: Partial<NuDetectSignUp>) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const { response, error } = useSelector((state) => state.nuDetectState);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const Schema = Yup.object().shape({
      username: Yup.string()
        .required('Please enter your user ID')
        .matches(/^[a-zA-Z0-9_]*$/, 'Incorrect user ID. Try alphanumeric characters'),
      password: Yup.string()
        .required('Please enter your password')
        .min(
          10,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        )
        .matches(
          /^[a-zA-Z0-9_]*$/,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        ),
      confirmPassword: Yup.string()
        .required('Please enter your password')
        .oneOf([Yup.ref('password'), null], 'Your passwords didn´t match. Try again')
    });

    const formik = useFormik<InitialValuesFormAccess>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        username,
        password,
        confirmPassword: ''
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setUsername(values.username);
        setPassword(values.password);

        const captcha = getCaptchaValues();

        onSignUp({
          creditCard,
          phoneNumber,
          username: values.username,
          password: values.password,
          ...(captcha && { captcha })
        });
      }
    });

    const { handleSubmit, getFieldProps, dirty, touched, errors } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      setDisabledHandleSubmit(dirty);
      // eslint-disable-next-line
    }, [dirty]);

    return (
      <Box>
        <Typography
          variant="subtitle2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          ACCESS
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          3 / 3
        </Typography>

        <Typography variant="body1" fontSize={18} color={(theme) => theme.palette.grey[900]} mb={4}>
          Please specify a new user ID and password for your mobile banking:
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
                  Choose a User ID
                </Typography>

                <CssTextField
                  {...getFieldProps('username')}
                  id="username"
                  fullWidth
                  placeholder="USER ID"
                  color="secondary"
                  size="small"
                  InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                  error={
                    Boolean(touched.username && errors.username) ||
                    Boolean(error && (error as any).status === 409)
                  }
                  helperText={
                    (touched.username && errors.username) ||
                    (error &&
                      (error as any).status === 409 &&
                      'This user ID already exists, try again')
                  }
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Choose a Password
                </Typography>

                <CssTextField
                  {...getFieldProps('password')}
                  id="password"
                  fullWidth
                  placeholder="PASSWORD"
                  color="secondary"
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          <Image src={showPassword ? IcEyeOpen : IcEyeClose} alt="Password" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Re-enter the Password
                </Typography>

                <CssTextField
                  {...getFieldProps('confirmPassword')}
                  id="confirmPassword"
                  fullWidth
                  placeholder="PASSWORD"
                  color="secondary"
                  size="small"
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          <Image
                            src={showConfirmPassword ? IcEyeOpen : IcEyeClose}
                            alt="Password"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
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
