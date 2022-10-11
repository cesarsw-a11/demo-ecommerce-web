import { forwardRef, useImperativeHandle, KeyboardEvent, useEffect } from 'react';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
// @mui
import {
  alpha,
  Box,
  Stack,
  Typography,
  Button,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useSelector } from '../redux/store';
// components
import { IconButtonAnimate } from '../components/animate';
// utils
import getIcon from '../utils/getIcon';

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
      onBack,
      onNext
    }: {
      onBack?: () => void;
      onNext: (OTP?: string) => void;
    },
    ref: any
  ) => {
    const { error } = useSelector((state) => state.nuDetectState);

    useEffect(() => {
      if (error && onBack) {
        if ((error as any).status !== 409) {
          onBack();
        }
      }
      // eslint-disable-next-line
    }, [error]);

    const validationSchema = Yup.object().shape({
      code1: Yup.number().required('Incorrect password'),
      code2: Yup.number().required('Incorrect password'),
      code3: Yup.number().required('Incorrect password'),
      code4: Yup.number().required('Incorrect password'),
      code5: Yup.number().required('Incorrect password'),
      code6: Yup.number().required('Incorrect password')
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
      validationSchema,
      onSubmit: async (values) => {
        const OTP = Object.keys(values)
          .map((name) => values[name as ValueNames])
          .join('');
        onNext(OTP);
      }
    });

    const { handleSubmit, values, setFieldValue } = formik;

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

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
      <>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          position={{ xs: 'fixed', sm: 'inherit' }}
          top={0}
          left={0}
          width="100%"
          height={56}
          px={{ xs: 2, sm: 0 }}
          bgcolor={(theme) => theme.palette.common.white}
          zIndex={9}
          mb={{ sm: 7 }}
        >
          {onBack && (
            <IconButtonAnimate onClick={onBack} sx={{ color: 'text.primary' }}>
              <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
                {getIcon('ic_back')}
              </Box>
            </IconButtonAnimate>
          )}

          <Typography
            flexGrow={1}
            variant="subtitle1"
            textAlign="center"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            Confirm Code
          </Typography>

          {onBack && <Box width={38} />}
        </Stack>

        <Box maxWidth={330} mx="auto">
          <Typography
            variant="body2"
            color={(theme) => theme.palette.grey[700]}
            fontSize={18}
            mb={{ xs: 5, sm: 6 }}
          >
            We sent a code to your mobile phone <b>(***) *** **41</b>
            <br />
            Enter it below.
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
                    error={Boolean(error && (error as any).status === 409)}
                  />
                ))}
              </Stack>

              {Boolean(error && (error as any).status === 409) && (
                <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                  Incorrect password
                </FormHelperText>
              )}

              <Box height={(theme) => theme.spacing(5)} />

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
                mb={{ sm: 20 }}
              >
                RESEND
              </Typography>
            </Form>
          </FormikProvider>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            position={{ xs: 'fixed', sm: 'relative' }}
            bottom={{ xs: 0, sm: 'unset' }}
            left={{ xs: 0, sm: 'unset' }}
            width={{ xs: '100%', sm: 'unset' }}
            height={{ xs: 88, sm: 'unset' }}
            px={{ xs: 2, sm: 'unset' }}
            bgcolor={(theme) => ({ xs: theme.palette.common.white, sm: 'unset' })}
            boxShadow={(theme) => ({
              xs: `0px 3px 8px ${alpha(theme.palette.common.black, 0.25)}`,
              sm: 'unset'
            })}
            mt={{ sm: 2 }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleSubmit()}
              disabled={!Boolean(getValueComplete().length === 6)}
            >
              <Typography
                variant="subtitle1"
                textAlign="center"
                fontFamily="Roboto"
                fontWeight={500}
              >
                CONTINUE
              </Typography>
            </Button>
          </Stack>
        </Box>
      </>
    );
  }
);
