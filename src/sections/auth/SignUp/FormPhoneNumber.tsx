import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
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

type InitialValuesFormPhoneNumber = {
  phoneNumber: string;
  afterSubmit?: string;
};

export default forwardRef(
  (
    {
      onNext,
      phoneNumber,
      setPhoneNumber,
      setDisabledHandleSubmit
    }: {
      onNext: () => void;
      phoneNumber: string;
      setPhoneNumber: (_v: string) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const Schema = Yup.object().shape({
      phoneNumber: Yup.string()
        .required('Enter a 10 digit number')
        .min(10, 'Enter a 10 digit number')
    });

    const formik = useFormik<InitialValuesFormPhoneNumber>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        phoneNumber
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setPhoneNumber(values.phoneNumber);
        onNext();
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
          PHONE NUMBER
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          2 / 3
        </Typography>

        <Typography variant="body1" fontSize={18} color={(theme) => theme.palette.grey[900]} mb={4}>
          Please enter your phone number registered with the bank:
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
                  Phone number
                </Typography>

                <CssTextField
                  {...getFieldProps('phoneNumber')}
                  id="phoneNumber"
                  fullWidth
                  placeholder="(505) 265 6919"
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
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    );
  }
);
