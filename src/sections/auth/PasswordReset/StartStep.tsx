import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Link, Stack, Typography, FormControl, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Image from '../../../components/Image';

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
  afterSubmit?: string;
};

export default function StartStep({
  onNext,
  username,
  setUsername
}: {
  onNext: () => void;
  username: string;
  setUsername: (_v: string) => void;
}) {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Please enter your user ID')
      .matches(/^[a-zA-Z0-9_]*$/, 'Incorrect user ID. Try alphanumeric characters')
  });

  const formik = useFormik<InitialValuesFormAccess>({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      username
    },
    validationSchema,
    onSubmit: async (values) => {
      setUsername(values.username);
      onNext();
    }
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={10}>
        <Image src={require('../../../assets/logo.png')} alt="Logo" />
      </Stack>

      <Stack spacing={3} mb={10}>
        <FormControl>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            What is your user ID?
          </Typography>

          <CssTextField
            {...getFieldProps('username')}
            id="username"
            fullWidth
            placeholder="USER ID"
            color="secondary"
            size="small"
            InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
        </FormControl>

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

      <Button fullWidth variant="contained" size="large" onClick={() => handleSubmit()}>
        <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto" fontWeight={500}>
          RESET PASSWORD
        </Typography>
      </Button>
    </>
  );
}
