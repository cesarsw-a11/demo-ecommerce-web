import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
// @mui
import {
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

interface AboutYou {
  firstName: string;
  middleInitial: string;
  lastName: string;
  dateOfBirth: {
    mm: string;
    dd: string;
    yyyy: string;
  };
  citizenship: string;
  last4DigitalOfSocialSecurityNumber: string;
}

interface InitialValuesFormAboutYou extends AboutYou {
  afterSubmit?: string;
}

export default forwardRef(
  (
    {
      onNext,
      aboutYou,
      setAboutYou,
      setDisabledHandleSubmit
    }: {
      onNext: () => void;
      aboutYou: AboutYou | null;
      setAboutYou: (_v: AboutYou) => void;
      setDisabledHandleSubmit: (value: boolean) => void;
    },
    ref: any
  ) => {
    const Schema = Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      dateOfBirth: Yup.object().shape({
        mm: Yup.number()
          .required('Enter the month of your date of birth')
          .min(1, 'Enter the month of your date of birth')
          .max(12, 'Enter the month of your date of birth'),
        dd: Yup.number()
          .required('Enter the day of your date of birth')
          .min(1, 'Enter the day of your date of birth')
          .max(31, 'Enter the day of your date of birth'),
        yyyy: Yup.number()
          .required('Enter the year your date of birth')
          .min(1900, 'Enter the year your date of birth')
          .max(2005, 'Enter the year your date of birth')
      }),
      last4DigitalOfSocialSecurityNumber: Yup.string()
        .trim()
        .required('Enter the last 4 digits of your social security number')
        .matches(/^[0-9]+$/, 'Enter the last 4 digits of your social security number')
        .min(4, 'Enter the last 4 digits of your social security number'),
      citizenship: Yup.string().required('Select an option from the list')
    });

    const formik = useFormik<InitialValuesFormAboutYou>({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        firstName: aboutYou?.firstName || '',
        middleInitial: aboutYou?.middleInitial || '',
        lastName: aboutYou?.lastName || '',
        dateOfBirth: {
          mm: aboutYou?.dateOfBirth.mm || '  ',
          dd: aboutYou?.dateOfBirth.dd || '  ',
          yyyy: aboutYou?.dateOfBirth.yyyy || '    '
        },
        citizenship: aboutYou?.citizenship || '',
        last4DigitalOfSocialSecurityNumber: aboutYou?.last4DigitalOfSocialSecurityNumber || '    '
      },
      validationSchema: Schema,
      onSubmit: async (values) => {
        setAboutYou(values);
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

    const handleChangeSocialWithNextField = (event: ChangeEvent<HTMLInputElement>) => {
      const { maxLength, value, name } = event.target;
      const fieldIndex = name.replace('social', '');

      const fieldIntIndex = Number(fieldIndex);

      if (value.length >= maxLength) {
        if (fieldIntIndex < 5) {
          const nextfield = document.querySelector(`input[name=social${fieldIntIndex + 1}]`);

          if (nextfield !== null) {
            (nextfield as HTMLElement).focus();
          }
        }
      }

      const { last4DigitalOfSocialSecurityNumber } = values;
      setFieldValue(
        'last4DigitalOfSocialSecurityNumber',
        last4DigitalOfSocialSecurityNumber.substring(0, fieldIntIndex - 1) +
          (value || ' ') +
          last4DigitalOfSocialSecurityNumber.substring(fieldIntIndex)
      );
    };

    const handleChangeDateWithNextField = (event: ChangeEvent<HTMLInputElement>) => {
      const { maxLength, value, name } = event.target;
      const fieldIndex = name.replace('date', '');

      const fieldIntIndex = Number(fieldIndex);

      if (value.length >= maxLength) {
        if (fieldIntIndex < 9) {
          const nextfield = document.querySelector(`input[name=date${fieldIntIndex + 1}]`);

          if (nextfield !== null) {
            (nextfield as HTMLElement).focus();
          }
        }
      }

      if ([1, 2].includes(fieldIntIndex)) {
        const {
          dateOfBirth: { mm }
        } = values;
        setFieldValue(
          'dateOfBirth.mm',
          mm.substring(0, fieldIntIndex - 1) + (value || ' ') + mm.substring(fieldIntIndex)
        );
      }

      if ([3, 4].includes(fieldIntIndex)) {
        const _fieldIntIndex = fieldIntIndex - 2;
        const {
          dateOfBirth: { dd }
        } = values;
        setFieldValue(
          'dateOfBirth.dd',
          dd.substring(0, _fieldIntIndex - 1) + (value || ' ') + dd.substring(_fieldIntIndex)
        );
      }

      if ([5, 6, 7, 8].includes(fieldIntIndex)) {
        const _fieldIntIndex = fieldIntIndex - 4;
        const {
          dateOfBirth: { yyyy }
        } = values;
        setFieldValue(
          'dateOfBirth.yyyy',
          yyyy.substring(0, _fieldIntIndex - 1) + (value || ' ') + yyyy.substring(_fieldIntIndex)
        );
      }
    };

    return (
      <Box>
        <Typography
          variant="subtitle2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          ABOUT YOU
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color={(theme) => theme.palette.grey[900]}
          mb={5}
        >
          1 / 3
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
                  First Name
                </Typography>

                <CssTextField
                  {...getFieldProps('firstName')}
                  id="firstName"
                  fullWidth
                  placeholder="FIRST NAME"
                  color="secondary"
                  size="small"
                  InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Middle Initial (optional)
                </Typography>

                <CssTextField
                  {...getFieldProps('middleInitial')}
                  id="middleInitial"
                  fullWidth
                  placeholder="MIDDLE INITIAL"
                  color="secondary"
                  size="small"
                  InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                  error={Boolean(touched.middleInitial && errors.middleInitial)}
                  // helperText={touched.middleInitial && errors.middleInitial}
                />
              </FormControl>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Last Name
                </Typography>

                <CssTextField
                  {...getFieldProps('lastName')}
                  id="lastName"
                  fullWidth
                  placeholder="LAST NAME"
                  color="secondary"
                  size="small"
                  InputProps={{ sx: { fontFamily: 'Roboto', fontWeight: 800 } }}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </FormControl>

              <Stack>
                <FormControl>
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={(theme) => theme.palette.grey[900]}
                    mb={1}
                  >
                    Date of Birth
                  </Typography>
                </FormControl>

                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  {[1, 2].map((name) => (
                    <Stack key={name}>
                      <CssOutlinedInput
                        color="secondary"
                        name={`date${name}`}
                        onChange={handleChangeDateWithNextField}
                        inputComponent={CodeMask as any}
                        inputProps={{
                          maxLength: 1,
                          sx: {
                            fontSize: 24,
                            p: 0,
                            textAlign: 'center',
                            width: 32,
                            height: 40
                          }
                        }}
                        error={Boolean(errors.dateOfBirth?.mm)}
                      />

                      {name === 1 && (
                        <Typography
                          variant="caption"
                          fontWeight={300}
                          color={(theme) => theme.palette.grey[700]}
                          lineHeight={1.2}
                          mt={0.5}
                        >
                          MM
                        </Typography>
                      )}
                    </Stack>
                  ))}

                  <Box
                    bgcolor={(theme) => theme.palette.grey[900]}
                    width={9}
                    height={6}
                    mt={(theme) => `${theme.spacing(2.1)}!important`}
                  />

                  {[3, 4].map((name) => (
                    <Stack key={name}>
                      <CssOutlinedInput
                        color="secondary"
                        name={`date${name}`}
                        onChange={handleChangeDateWithNextField}
                        inputComponent={CodeMask as any}
                        inputProps={{
                          maxLength: 1,
                          sx: {
                            fontSize: 24,
                            p: 0,
                            textAlign: 'center',
                            width: 32,
                            height: 40
                          }
                        }}
                        error={Boolean(errors.dateOfBirth?.dd)}
                      />

                      {name === 3 && (
                        <Typography
                          variant="caption"
                          fontWeight={300}
                          color={(theme) => theme.palette.grey[700]}
                          lineHeight={1.2}
                          mt={0.5}
                        >
                          DD
                        </Typography>
                      )}
                    </Stack>
                  ))}

                  <Box
                    bgcolor={(theme) => theme.palette.grey[900]}
                    width={9}
                    height={6}
                    mt={(theme) => `${theme.spacing(2.1)}!important`}
                  />

                  {[5, 6, 7, 8].map((name) => (
                    <Stack key={name}>
                      <CssOutlinedInput
                        color="secondary"
                        name={`date${name}`}
                        onChange={handleChangeDateWithNextField}
                        inputComponent={CodeMask as any}
                        inputProps={{
                          maxLength: 1,
                          sx: {
                            fontSize: 24,
                            p: 0,
                            textAlign: 'center',
                            width: 32,
                            height: 40
                          }
                        }}
                        error={Boolean(errors.dateOfBirth?.yyyy)}
                      />

                      {name === 5 && (
                        <Typography
                          variant="caption"
                          fontWeight={300}
                          color={(theme) => theme.palette.grey[700]}
                          lineHeight={1.2}
                          mt={0.5}
                        >
                          YYYY
                        </Typography>
                      )}
                    </Stack>
                  ))}
                </Stack>

                {Boolean(errors.dateOfBirth?.mm) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    Enter the month of your date of birth
                  </FormHelperText>
                )}

                {Boolean(errors.dateOfBirth?.dd) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    Enter the day of your date of birth
                  </FormHelperText>
                )}

                {Boolean(errors.dateOfBirth?.yyyy) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    Enter the year your date of birth
                  </FormHelperText>
                )}
              </Stack>

              <FormControl>
                <Typography
                  variant="body1"
                  fontWeight={300}
                  color={(theme) => theme.palette.grey[900]}
                  mb={1}
                >
                  Citizenship
                </Typography>

                <Select
                  displayEmpty
                  value={values.citizenship}
                  onChange={(e: any) => setFieldValue('citizenship', e.target.value as string)}
                  input={<CssOutlinedInput />}
                  size="small"
                  color="secondary"
                  renderValue={(selected) => {
                    if (!Boolean(selected)) {
                      return <b style={{ color: '#C4C8CF' }}>SELECT A CITIZENSHIP</b>;
                    }

                    return (selected as string).toUpperCase();
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  error={Boolean(touched.citizenship && errors.citizenship)}
                >
                  <MenuItem value="Citizen">CITIZEN</MenuItem>
                  <MenuItem value="Resident">RESIDENT</MenuItem>
                  <MenuItem value="Non-Resident">NON-RESIDENT</MenuItem>
                </Select>

                {Boolean(touched.citizenship && errors.citizenship) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    {touched.citizenship && errors.citizenship}
                  </FormHelperText>
                )}
              </FormControl>

              <Stack>
                <FormControl>
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={(theme) => theme.palette.grey[900]}
                    mb={1}
                  >
                    Last 4 Digital of Social Security Number
                  </Typography>
                </FormControl>

                <Stack direction="row" spacing={0.5}>
                  {[1, 2, 3, 4].map((name) => (
                    <CssOutlinedInput
                      key={name}
                      color="secondary"
                      name={`social${name}`}
                      onChange={handleChangeSocialWithNextField}
                      inputComponent={CodeMask as any}
                      inputProps={{
                        maxLength: 1,
                        sx: {
                          fontSize: 24,
                          p: 0,
                          textAlign: 'center',
                          width: 32,
                          height: 40
                        }
                      }}
                      error={Boolean(errors.last4DigitalOfSocialSecurityNumber)}
                    />
                  ))}
                </Stack>

                {Boolean(errors.last4DigitalOfSocialSecurityNumber) && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
                    Enter the last 4 digits of your social security number
                  </FormHelperText>
                )}
              </Stack>
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    );
  }
);
