import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
// @mui
import {
  Box,
  Divider,
  FormControl,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Image from '../../../components/Image';
// redux
import { useSelector } from '../../../redux/store';
//
import IcEyeOpen from '../../../assets/icons/ic_eye_open.svg';
import IcEyeClose from '../../../assets/icons/ic_eye_close.svg';
import { NuDetectForgotPassword } from '../../../@types/NuDetect';
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

type InitialValuesFormPhoneNumber = {
  newPassword: string;
  confirmNewPassword: string;
  afterSubmit?: string;
};

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit,
      newPassword,
      setNewPassword,
      onForgotPassword
    }: {
      onNext: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      newPassword: string;
      setNewPassword: (_v: string) => void;
      onForgotPassword: (_v: Partial<NuDetectForgotPassword>) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setConfirmShowNewPassword] = useState(false);

    const { response } = useSelector((state) => state.nuDetectState);

    const Schema = Yup.object().shape({
      newPassword: Yup.string()
        .required('Please enter your password')
        .min(
          10,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        )
        .matches(
          /^[a-zA-Z0-9_]*$/,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        ),
      confirmNewPassword: Yup.string()
        .required('Please enter your password')
        .oneOf([Yup.ref('newPassword'), null], 'Your passwords didn´t match. Try again')
    });

    const formik = useFormik<InitialValuesFormPhoneNumber>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        newPassword,
        confirmNewPassword: ''
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setNewPassword(values.newPassword);

        const captcha = getCaptchaValues();

        onForgotPassword({
          newPassword: values.newPassword,
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

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

    const handleClickShowConfirmShowNewPassword = () =>
      setConfirmShowNewPassword(!showConfirmNewPassword);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
      <Box>
        <Typography
          variant="subtitle1"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          Change password
        </Typography>

        <Divider sx={{ mb: 5 }} />

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
                  Enter a new password
                </Typography>

                <CssTextField
                  {...getFieldProps('newPassword')}
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  color="secondary"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          <Image src={showNewPassword ? IcEyeOpen : IcEyeClose} alt="Password" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Confirm the new password
                </Typography>

                <CssTextField
                  {...getFieldProps('confirmNewPassword')}
                  id="confirmNewPassword"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  fullWidth
                  color="secondary"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={handleClickShowConfirmShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          <Image
                            src={showConfirmNewPassword ? IcEyeOpen : IcEyeClose}
                            alt="Password"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                  helperText={touched.confirmNewPassword && errors.confirmNewPassword}
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
