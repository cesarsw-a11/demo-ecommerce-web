import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// @mui
import {
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
// redux
import { useSelector } from '../../../redux/store';
// components
import Image from '../../../components/Image';
//
import IcEyeOpen from '../../../assets/icons/ic_eye_open.svg';
import IcEyeClose from '../../../assets/icons/ic_eye_close.svg';
import { NuDetectSignIn } from '../../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../../sections/Captcha';

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

type InitialValues = {
  username: string;
  password: string;
  afterSubmit?: string;
};

export default function SignInForm({
  username,
  setUsername,
  password,
  setPassword,
  onSignIn
}: {
  username: string;
  setUsername: (_v: string) => void;
  password: string;
  setPassword: (_v: string) => void;
  onSignIn: (_v: Partial<NuDetectSignIn>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const { response, isLoading, error } = useSelector((state) => state.nuDetectState);

  const Schema = Yup.object().shape({
    username: Yup.string().required('Please enter your user ID'),
    password: Yup.string().required('Please enter your user ID')
  });

  const formik = useFormik<InitialValues>({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      username,
      password
    },
    validationSchema: Schema,
    onSubmit: async (values) => {
      setUsername(values.username);
      setPassword(values.password);

      const captcha = getCaptchaValues();

      onSignIn({
        username: values.username,
        password: values.password,
        ...(captcha && { captcha })
      });
    }
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} mb={15}>
          <FormControl>
            <Typography
              variant="body1"
              fontWeight={300}
              color={(theme) => theme.palette.grey[900]}
              mb={1}
            >
              What is your ID?
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
                Boolean(error && (error as any).status === 404)
              }
              helperText={
                (touched.username && errors.username) ||
                (error && (error as any).status === 404 && 'Incorrect user ID')
              }
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </FormControl>

          <FormControl>
            <Typography
              variant="body1"
              fontWeight={300}
              color={(theme) => theme.palette.grey[900]}
              mb={1}
            >
              What is your Password?
            </Typography>

            <CssTextField
              {...getFieldProps('password')}
              id="password"
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              color="secondary"
              placeholder="PASSWORD"
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
              error={
                Boolean(touched.password && errors.password) ||
                Boolean(error && (error as any).status === 401)
              }
              helperText={
                (touched.password && errors.password) ||
                (error && (error as any).status === 401 && 'Incorrect password')
              }
            />
          </FormControl>

          {response && response.hasCaptcha && <Captcha captcha={response.captcha} />}

          <Typography
            replace
            variant="subtitle1"
            component={RouterLink}
            to="/password-reset"
            textAlign="center"
            fontFamily="Roboto"
            fontWeight={500}
            color={(theme) => theme.palette.primary.main}
            sx={{ textDecoration: 'unset' }}
          >
            FORGOT PASSWORD?
          </Typography>

          <Typography
            variant="caption"
            textAlign="center"
            fontWeight={300}
            color={(theme) => theme.palette.grey[700]}
          >
            Don´t have an account?{' '}
            <Link
              variant="overline"
              component={RouterLink}
              to="/"
              replace
              fontFamily="Roboto"
              fontWeight={800}
              sx={{ textTransform: 'unset', textDecoration: 'unset' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Stack>

        <Stack spacing={3} mb={5}>
          <LoadingButton
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            loading={isLoading}
          >
            <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto" fontWeight={500}>
              SIGN IN
            </Typography>
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
