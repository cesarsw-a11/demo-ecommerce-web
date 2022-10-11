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

const CardNumberMask = forwardRef<HTMLElement, MaskProps>((props, ref) => {
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
      format="#### #### #### ####"
    />
  );
});

type InitialValuesFormBankCardDetails = {
  creditOrDebitCardNumber: string;
  afterSubmit?: string;
};

export default forwardRef(
  (
    {
      onNext,
      creditCard,
      setCreditCard,
      setDisabledHandleSubmit
    }: {
      onNext: () => void;
      creditCard: string;
      setCreditCard: (_v: string) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const Schema = Yup.object().shape({
      creditOrDebitCardNumber: Yup.string()
        .required('Enter a 16 digit card number')
        .min(16, 'Enter a 16 digit card number')
    });

    const formik = useFormik<InitialValuesFormBankCardDetails>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        creditOrDebitCardNumber: creditCard
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setCreditCard(values.creditOrDebitCardNumber);
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
          BANK CARD DETAILS
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          1 / 3
        </Typography>

        <Typography variant="body1" fontSize={18} color={(theme) => theme.palette.grey[900]} mb={4}>
          Please enter your existing Bank Card number:
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
                  Credit or debit card number
                </Typography>

                <CssTextField
                  {...getFieldProps('creditOrDebitCardNumber')}
                  id="creditOrDebitCardNumber"
                  fullWidth
                  placeholder="1234 0000 0000 0000"
                  color="secondary"
                  size="small"
                  InputProps={{
                    inputComponent: CardNumberMask as any,
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.creditOrDebitCardNumber && errors.creditOrDebitCardNumber)}
                  helperText={touched.creditOrDebitCardNumber && errors.creditOrDebitCardNumber}
                />
              </FormControl>
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    );
  }
);
