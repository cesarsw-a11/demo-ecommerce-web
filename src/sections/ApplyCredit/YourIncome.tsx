import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import {
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const CssOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 800,
  '& fieldset': {
    borderColor: theme.palette.grey[900]
  }
}));

// ----------------------------------------------------------------------

type MaskProps = {
  onChange: (event: { target: { name: string; value: string; maxLength?: number } }) => void;
  name: string;
};

// ----------------------------------------------------------------------

const AmountMask = forwardRef<HTMLElement, MaskProps>((props, ref) => {
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
      prefix="$"
      isNumericString
      thousandSeparator={true}
      allowNegative={false}
      decimalScale={2}
    />
  );
});

type InitialValuesFormYourIncome = {
  occupation: string;
  grossAnnualIncome: string;
  monthlyMortgage: string;
  monthlyCreditCard: string;
  afterSubmit?: string;
};

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit
    }: { onNext: () => void; setDisabledHandleSubmit: (value: boolean) => void },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const Schema = Yup.object().shape({
      occupation: Yup.string().required('Select an option from the list'),
      grossAnnualIncome: Yup.number().required('Enter an amount').min(1, 'Enter an amount'),
      monthlyMortgage: Yup.number().required('Enter an amount').min(0, 'Enter an amount'),
      monthlyCreditCard: Yup.number().required('Enter an amount').min(0, 'Enter an amount')
    });

    const formik = useFormik<InitialValuesFormYourIncome>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        occupation: '',
        grossAnnualIncome: '',
        monthlyMortgage: '',
        monthlyCreditCard: ''
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        onNext();
      }
    });

    const { handleSubmit, getFieldProps, dirty, touched, errors, values, setFieldValue } = formik;

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
          YOUR INCOME
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          2 / 3
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
                  Occupation status
                </Typography>

                <Select
                  displayEmpty
                  value={values.occupation}
                  onChange={(e: any) => setFieldValue('occupation', e.target.value as string)}
                  input={<CssOutlinedInput />}
                  size="small"
                  color="secondary"
                  renderValue={(selected) => {
                    if (!Boolean(selected)) {
                      return <b style={{ color: '#C4C8CF' }}>SELECT YOUR STATUS</b>;
                    }

                    return (selected as string).toUpperCase();
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  error={Boolean(touched.occupation && errors.occupation)}
                >
                  <MenuItem value="Employed" sx={{ textTransform: 'uppercase' }}>
                    Employed
                  </MenuItem>
                  <MenuItem value="Not employed - Unemployed" sx={{ textTransform: 'uppercase' }}>
                    Not employed - Unemployed
                  </MenuItem>
                  <MenuItem value="Not employed - Homemaker" sx={{ textTransform: 'uppercase' }}>
                    Not employed - Homemaker
                  </MenuItem>
                  <MenuItem value="Retired" sx={{ textTransform: 'uppercase' }}>
                    Retired
                  </MenuItem>
                  <MenuItem value="Self-Employed - Partnership" sx={{ textTransform: 'uppercase' }}>
                    Self-Employed - Partnership
                  </MenuItem>
                  <MenuItem
                    value="Self-Employed - Company Director"
                    sx={{ textTransform: 'uppercase' }}
                  >
                    Self-Employed - Company Director
                  </MenuItem>
                  <MenuItem value="Self-Employed - Soletrader" sx={{ textTransform: 'uppercase' }}>
                    Self-Employed - Soletrader
                  </MenuItem>
                </Select>

                {Boolean(touched.occupation && errors.occupation) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    {touched.occupation && errors.occupation}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Gross annual income
                </Typography>

                <CssTextField
                  {...getFieldProps('grossAnnualIncome')}
                  id="grossAnnualIncome"
                  fullWidth
                  placeholder="$ 0.00"
                  color="secondary"
                  size="small"
                  InputProps={{
                    inputComponent: AmountMask as any,
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.grossAnnualIncome && errors.grossAnnualIncome)}
                  helperText={touched.grossAnnualIncome && errors.grossAnnualIncome}
                />

                <Typography
                  variant="caption"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[700]}
                  lineHeight={1.2}
                  mt={1}
                >
                  This includes any salary, self employed work or other regular payments you'll
                  receive in the next 12 months e.g. child maintenance, pensions or guaranteed
                  child, incapacity or care benefits
                </Typography>
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Monthly mortgage / rent payments
                </Typography>

                <CssTextField
                  {...getFieldProps('monthlyMortgage')}
                  id="monthlyMortgage"
                  fullWidth
                  placeholder="$ 0.00"
                  color="secondary"
                  size="small"
                  InputProps={{
                    inputComponent: AmountMask as any,
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.monthlyMortgage && errors.monthlyMortgage)}
                  helperText={touched.monthlyMortgage && errors.monthlyMortgage}
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Monthly credit card / loan payments
                </Typography>

                <CssTextField
                  {...getFieldProps('monthlyCreditCard')}
                  id="monthlyCreditCard"
                  fullWidth
                  placeholder="$ 0.00"
                  color="secondary"
                  size="small"
                  InputProps={{
                    inputComponent: AmountMask as any,
                    sx: { fontFamily: 'Roboto', fontWeight: 800 }
                  }}
                  error={Boolean(touched.monthlyCreditCard && errors.monthlyCreditCard)}
                  helperText={touched.monthlyCreditCard && errors.monthlyCreditCard}
                />
              </FormControl>
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    );
  }
);
