import * as Yup from 'yup';
import { useFormik } from 'formik';
import NumberFormat from 'react-number-format';
import { Hint } from 'react-autocomplete-hint';
import { useEffect, forwardRef, ChangeEvent, useImperativeHandle } from 'react';
// @mui
import {
  Box,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Radio
} from '@mui/material';
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

type AccountNumberMaskProps = {
  onChange: (event: { target: { name: string; value: string; maxLength?: number } }) => void;
  name: string;
};

// ----------------------------------------------------------------------

const AccountNumberMask = forwardRef<HTMLElement, AccountNumberMaskProps>((props, ref) => {
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
      format="###########"
    />
  );
});

// ----------------------------------------------------------------------

type HintMaskProps = {
  onChange: (event: { target: { name: string; value: string; maxLength?: number } }) => void;
  value: string;
  name: string;
};

const HintMask = forwardRef<HTMLElement, HintMaskProps>((props, ref) => {
  const { onChange, value, ...other } = props;

  return (
    <Box
      width="100%"
      {...other}
      sx={{
        '& input': { p: 0, fontFamily: 'Roboto', fontWeight: 800 },
        '& .rah-hint-wrapper input': { color: (theme) => `${theme.palette.grey[500]}!important` }
      }}
    >
      <Hint
        options={[
          'American Electric Lighting',
          'AT&T Internet',
          'Quicken Loans Inc.',
          'United Shore Financial Services',
          'CMG Mortage Inc.',
          'JP Morgan Chase',
          'General Motors',
          'Walgreens Boots Alliance ',
          'General Electric',
          'Dell Technologies',
          'Meta Plataforms Inc.',
          'United Parcel Service',
          'HCA Healtcare',
          'Oracle Corporation',
          'Capital One'
        ]}
        allowTabFill
      >
        <input {...other} value={value} onChange={onChange} />
      </Hint>
    </Box>
  );
});

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit,
      payee,
      setPayee
    }: {
      onNext: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      payee: {
        type: 'PERSONAL' | 'BUSINESS';
        name: string;
        account: string;
        zipCode: string;
      } | null;
      setPayee: (
        _v: {
          type: 'PERSONAL' | 'BUSINESS';
          name: string;
          account: string;
          zipCode: string;
        } | null
      ) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('Payee name is required'),
      account: Yup.string()
        .required('Enter a 11 digit account number')
        .min(11, 'Enter a 11 digit account number'),
      zipCode: Yup.string().required('Zip Code is required')
    });

    const formik = useFormik<{
      type: 'PERSONAL' | 'BUSINESS';
      name: string;
      account: string;
      zipCode: string;
      afterSubmit?: string;
    }>({
      validateOnMount: true,
      initialValues: {
        type: payee?.type || 'PERSONAL',
        name: payee?.name || '',
        account: payee?.account || '',
        zipCode: payee?.zipCode || ''
      },
      validationSchema,
      onSubmit: async (values) => {
        setPayee({
          type: values.type,
          name: values.name,
          account: values.account,
          zipCode: values.zipCode
        });
        onNext();
      }
    });
    const { handleSubmit, getFieldProps, touched, errors, values, setFieldValue, dirty } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      if (payee) setDisabledHandleSubmit(true);
      else setDisabledHandleSubmit(dirty);
      // eslint-disable-next-line
    }, [payee, dirty]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue('type', (event.target as HTMLInputElement).value as any);
      setFieldValue('name', '');
    };

    return (
      <>
        <FormControl sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            Account type
          </Typography>

          <RadioGroup value={values.type} onChange={handleChange} row>
            <FormControlLabel
              value="PERSONAL"
              control={<Radio />}
              label={
                <Typography
                  variant="subtitle2"
                  {...(values.type !== 'PERSONAL' && {
                    color: (theme) => theme.palette.grey[500]
                  })}
                >
                  Personal
                </Typography>
              }
            />

            <FormControlLabel
              value="BUSINESS"
              control={<Radio />}
              label={
                <Typography
                  variant="subtitle2"
                  {...(values.type !== 'BUSINESS' && {
                    color: (theme) => theme.palette.grey[500]
                  })}
                >
                  Business
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            {values.type === 'PERSONAL' ? 'Payee name' : 'Company name'}
          </Typography>

          <CssTextField
            {...getFieldProps('name')}
            id="name"
            fullWidth
            placeholder={
              values.type === 'PERSONAL' ? 'ENTER THE PAYEE NAME' : 'ENTER THE COMPANY NAME'
            }
            color="secondary"
            size="small"
            InputProps={{
              sx: { fontFamily: 'Roboto', fontWeight: 800 },
              ...(values.type === 'BUSINESS' && {
                inputComponent: HintMask as any
              })
            }}
            helperText={
              Boolean(touched.name && errors.name) &&
              `${values.type === 'PERSONAL' ? 'Payee' : 'Company'} name is required`
            }
            error={Boolean(touched.name && errors.name)}
          />
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            Account number
          </Typography>

          <CssTextField
            {...getFieldProps('account')}
            id="account"
            fullWidth
            placeholder="12340000000"
            color="secondary"
            size="small"
            InputProps={{
              inputComponent: AccountNumberMask as any,
              sx: { fontFamily: 'Roboto', fontWeight: 800 }
            }}
            helperText={touched.account && errors.account}
            error={Boolean(touched.account && errors.account)}
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
            helperText={touched.zipCode && errors.zipCode}
            error={Boolean(touched.zipCode && errors.zipCode)}
          />
        </FormControl>
      </>
    );
  }
);
