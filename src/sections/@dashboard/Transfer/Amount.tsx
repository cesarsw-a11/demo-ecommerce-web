import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik } from 'formik';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import { Typography, FormControl, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../../hooks/useResponsive';
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

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit,
      amount,
      setAmount,
      remark,
      setRemark,
      maxAmount
    }: {
      onNext: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      amount: number;
      setAmount: (_v: number) => void;
      remark: string;
      setRemark: (_v: string) => void;
      maxAmount: number;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const isUpSm = useResponsive('up', 'sm');

    const Schema = Yup.object().shape({
      amount: Yup.number()
        .required('')
        .min(0.01, '')
        .max(maxAmount, 'You do not have sufficient funds to proceed with this transfer'),
      remark: Yup.string()
    });

    const formik = useFormik<{
      amount: number;
      remark: string;
      afterSubmit?: string;
    }>({
      validateOnMount: true,
      initialValues: {
        amount,
        remark
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setAmount(values.amount);
        setRemark(values.remark);
        onNext();
      }
    });

    const { handleSubmit, getFieldProps, touched, errors, values } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      if (Number(values.amount) > 0) setDisabledHandleSubmit(true);
      else setDisabledHandleSubmit(false);
      // eslint-disable-next-line
    }, [values.amount]);

    return (
      <>
        {isUpSm ? (
          <Typography
            variant="subtitle2"
            fontFamily="Roboto"
            fontSize={18}
            textAlign="center"
            color={(theme) => theme.palette.grey[900]}
            mb={4}
          >
            Enter an amount
          </Typography>
        ) : (
          <Typography
            variant="subtitle2"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
            mb={4}
          >
            Amount
          </Typography>
        )}

        <FormControl sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            Amount
          </Typography>

          <CssTextField
            {...getFieldProps('amount')}
            id="amount"
            fullWidth
            placeholder="$ 0.00"
            color="secondary"
            inputProps={{
              sx: {
                textAlign: 'center'
              }
            }}
            InputProps={{
              inputComponent: AmountMask as any,
              sx: {
                fontFamily: 'Roboto',
                fontWeight: 800,
                height: 80,
                fontSize: 24
              }
            }}
            onFocus={(e) => e.target.select()}
            error={
              Boolean(touched.amount && errors.amount) ||
              (touched.amount && !Boolean(Number(values.amount)))
            }
            helperText={touched.amount && errors.amount}
          />
        </FormControl>

        <FormControl>
          <Typography
            variant="body1"
            fontWeight={300}
            color={(theme) => theme.palette.grey[900]}
            mb={1}
          >
            Remark
          </Typography>

          <CssTextField
            {...getFieldProps('remark')}
            id="remark"
            fullWidth
            placeholder=""
            color="secondary"
            size="small"
            InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
            error={Boolean(touched.remark && errors.remark)}
          />
        </FormControl>
      </>
    );
  }
);
