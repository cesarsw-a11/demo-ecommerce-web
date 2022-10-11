import * as Yup from 'yup';
import { useFormik } from 'formik';
import { forwardRef, useImperativeHandle, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Divider,
  Typography,
  FormControl,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
// components
import Image from '../../../components/Image';
// redux
import { useSelector } from '../../../redux/store';
// utils
import IcEyeOpen from '../../../assets/icons/ic_eye_open.svg';
import IcEyeClose from '../../../assets/icons/ic_eye_close.svg';
// types
import { NuDetectChangePassword } from '../../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../Captcha';

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

interface ChangePasswordType {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface InitialValuesForm extends ChangePasswordType {
  afterSubmit?: string;
}

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setStep,
      setDisabledHandleSubmit,
      oldPassword,
      setOldPassword,
      newPassword,
      setNewPassword,
      onChangePassword
    }: {
      onNext: () => void;
      setStep: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      oldPassword: string;
      setOldPassword: (_v: string) => void;
      newPassword: string;
      setNewPassword: (_v: string) => void;
      onChangePassword: (_v: Partial<NuDetectChangePassword>) => void;
    },
    ref: any
  ) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setConfirmShowNewPassword] = useState(false);

    const { response, error } = useSelector((state) => state.nuDetectState);

    const validationSchema = Yup.object().shape({
      oldPassword: Yup.string().required('Please enter your password'),
      newPassword: Yup.string()
        .required('Please enter your new password')
        .min(
          10,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        )
        .matches(
          /^[a-zA-Z0-9_]*$/,
          'Short passwords are easy to guess. Try one with at least 10 alphanumeric characters'
        ),
      confirmNewPassword: Yup.string()
        .required('Please enter your new password')
        .oneOf([Yup.ref('newPassword'), null], 'Your passwords didn´t match. Try again')
    });

    const formik = useFormik<InitialValuesForm>({
      validateOnMount: true,
      enableReinitialize: true,
      initialValues: {
        oldPassword,
        newPassword,
        confirmNewPassword: newPassword
      },
      validationSchema,
      onSubmit: async (values) => {
        setOldPassword(values.oldPassword);
        setNewPassword(values.newPassword);

        const captcha = getCaptchaValues();

        onChangePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          ...(captcha && { captcha })
        });
      }
    });

    const { handleSubmit, getFieldProps, touched, errors } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

    const handleClickShowConfirmShowNewPassword = () =>
      setConfirmShowNewPassword(!showConfirmNewPassword);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
      <>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
            Change Password
          </Typography>

          {/* <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
            {getIcon('ic_edit')}
          </Box> */}
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
              Current password
            </Typography>

            <CssTextField
              {...getFieldProps('oldPassword')}
              id="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              fullWidth
              color="secondary"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={handleClickShowOldPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      <Image src={showOldPassword ? IcEyeOpen : IcEyeClose} alt="Password" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { fontFamily: 'Roboto', fontWeight: 800 }
              }}
              error={
                Boolean(touched.oldPassword && errors.oldPassword) ||
                Boolean(error && (error as any).status === 401)
              }
              helperText={
                (touched.oldPassword && errors.oldPassword) ||
                (error && (error as any).status === 401 && 'Incorrect password')
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
                      <Image src={showConfirmNewPassword ? IcEyeOpen : IcEyeClose} alt="Password" />
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
      </>
    );
  }
);
