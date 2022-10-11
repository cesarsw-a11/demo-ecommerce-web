import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle, KeyboardEvent } from 'react';
// @mui
import { Box, Stack, Typography, OutlinedInput, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

type MaskProps = {
  onChange: (event: { target: { name: string; value: string; maxLength?: number } }) => void;
  name: string;
};

// ----------------------------------------------------------------------

const CodeMask = forwardRef<HTMLElement, MaskProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
            maxLength: (props as any).maxLength
          }
        });
      }}
      prefix=""
      isNumericString
      format="#"
    />
  );
});

const CssOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 800,
  '& .MuiInputBase-input': {
    '&::selection': {
      background: 'transparent'
    },
    '&::-moz-selection': {
      background: 'transparent'
    }
  },
  '& fieldset': {
    borderColor: theme.palette.grey[900]
  }
}));

type InitialValuesFormConfirmationCode = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  afterSubmit?: string;
};

type ValueNames = 'code1' | 'code2' | 'code3' | 'code4' | 'code5' | 'code6';

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit
    }: { onNext: () => void; setDisabledHandleSubmit: (value: boolean) => void },
    ref: any
  ) => {
    const Schema = Yup.object().shape({
      code1: Yup.number().required('Incorrect password').oneOf([1, null], 'Incorrect password'),
      code2: Yup.number().required('Incorrect password').oneOf([2, null], 'Incorrect password'),
      code3: Yup.number().required('Incorrect password').oneOf([3, null], 'Incorrect password'),
      code4: Yup.number().required('Incorrect password').oneOf([4, null], 'Incorrect password'),
      code5: Yup.number().required('Incorrect password').oneOf([5, null], 'Incorrect password'),
      code6: Yup.number().required('Incorrect password').oneOf([6, null], 'Incorrect password')
    });

    const formik = useFormik<InitialValuesFormConfirmationCode>({
      validateOnMount: true,
      initialValues: {
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        code6: ''
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        onNext();
      }
    });

    const { handleSubmit, isValid, values, setFieldValue } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      setDisabledHandleSubmit(isValid);
      // eslint-disable-next-line
    }, [isValid]);

    const handleKeyUpWithNextField = (event: KeyboardEvent<HTMLInputElement>) => {
      const keyChar = String.fromCharCode(event.which || event.keyCode);
      if (!/[0-9]/.test(keyChar)) return;

      const { name } = event.target as any;

      const fieldIndex = name.replace('code', '');
      const fieldIntIndex = Number(fieldIndex);
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) (nextfield as HTMLElement).focus();
      }

      setFieldValue(name, keyChar);
    };

    const getValueComplete = () =>
      Object.keys(values)
        .map((name) => values[name as ValueNames])
        .join('');

    return (
      <Box>
        <Typography
          variant="subtitle2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          CONFIRMATION CODE
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          3 / 4
        </Typography>

        <Typography variant="body1" fontSize={18} color={(theme) => theme.palette.grey[900]} mb={4}>
          We have sent you a one- time password to your phone. Please enter it below:
        </Typography>

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1} justifyContent="center">
              {Object.keys(values).map((name, index) => (
                <CssOutlinedInput
                  id="field-code"
                  key={name}
                  color="secondary"
                  autoFocus={index === 0}
                  name={`code${index + 1}`}
                  value={values[name as ValueNames]}
                  onKeyUp={handleKeyUpWithNextField}
                  inputComponent={CodeMask as any}
                  inputProps={{
                    maxLength: 1,
                    sx: {
                      fontFamily: 'Roboto',
                      fontSize: 40,
                      fontWeight: 800,
                      p: 0,
                      textAlign: 'center',
                      width: 47,
                      height: 80
                    }
                  }}
                  error={Boolean(
                    getValueComplete().length === 6 && getValueComplete() !== '123456'
                  )}
                />
              ))}
            </Stack>

            {Boolean(getValueComplete().length === 6 && getValueComplete() !== '123456') && (
              <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                Incorrect password
              </FormHelperText>
            )}

            <Box height={(theme) => theme.spacing(2)} />

            <Typography
              variant="body1"
              textAlign="center"
              color={(theme) => theme.palette.grey[900]}
              fontFamily="Roboto"
              fontSize={12}
              fontWeight={500}
              mb={0.5}
            >
              Didn’t get the code?
            </Typography>

            <Typography
              variant="body1"
              textAlign="center"
              color={(theme) => theme.palette.primary.main}
              fontFamily="Roboto"
              fontWeight={500}
            >
              RESEND
            </Typography>
          </Form>
        </FormikProvider>
      </Box>
    );
  }
);
