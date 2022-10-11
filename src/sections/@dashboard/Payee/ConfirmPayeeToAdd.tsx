import { forwardRef, useImperativeHandle, useState } from 'react';
// @mui
import { alpha, Typography, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// types
import { NuDetectPayee } from '../../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../../sections/Captcha';

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      onBack,
      setDisabledHandleSubmit,
      payee,
      section,
      onPayee
    }: {
      onNext: () => void;
      onBack: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      payee: {
        type: 'PERSONAL' | 'BUSINESS';
        name: string;
        account: string;
        zipCode: string;
      } | null;
      section: 'transfer' | 'billpay';
      onPayee: (_v: Partial<NuDetectPayee>) => void;
    },
    ref: any
  ) => {
    const isUpSm = useResponsive('up', 'sm');
    const [submit, setSubmit] = useState(false);

    const { response } = useSelector((state) => state.nuDetectState);

    const handleSubmit = () => {
      const captcha = getCaptchaValues();

      onPayee({
        accountType: payee?.type || 'PERSONAL',
        firstName: payee?.name || '',
        accountNumber: payee?.account || '',
        zipCode: payee?.zipCode || '',
        ...(captcha && { captcha })
      });

      setSubmit(true);
    };

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    return (
      <>
        {!isUpSm && (
          <Typography
            variant="subtitle2"
            fontFamily="Roboto"
            textAlign="center"
            color={(theme) => theme.palette.grey[900]}
            mb={6}
          >
            CONFIRM PAYEE TO ADD
          </Typography>
        )}

        <Stack direction="row" spacing={1} px={{ xs: 2, sm: 0 }} mb={4}>
          <Typography
            flex={1}
            variant="body1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            Account type
          </Typography>
          <Typography
            flex={1}
            variant="subtitle1"
            fontFamily="Roboto"
            textTransform="capitalize"
            color={(theme) => theme.palette.grey[900]}
          >
            {(payee?.type || '').toLowerCase()}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} px={{ xs: 2, sm: 0 }} mb={4}>
          <Typography
            flex={1}
            variant="body1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            Payee name
          </Typography>
          <Typography
            flex={1}
            variant="subtitle1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            {payee?.name || ''}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} px={{ xs: 2, sm: 0 }} mb={4}>
          <Typography
            flex={1}
            variant="body1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            Account N°
          </Typography>
          <Typography
            flex={1}
            variant="subtitle1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            {payee?.account || ''}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} px={{ xs: 2, sm: 0 }} mb={10}>
          <Typography
            flex={1}
            variant="body1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            Zip Code
          </Typography>
          <Typography
            flex={1}
            variant="subtitle1"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
          >
            {payee?.zipCode || ''}
          </Typography>
        </Stack>

        {!submit && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="inherit"
            sx={{
              maxWidth: 330,
              mx: 'auto',
              mb: 2,
              color: (theme) => theme.palette.grey[900],
              bgcolor: (theme) => theme.palette.common.white,
              boxShadow: (theme) =>
                `0px 3px 8px ${alpha(theme.palette.common.black, 0.25)}!important`
            }}
            onClick={onBack}
          >
            <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto">
              Edit
            </Typography>
          </Button>
        )}

        {response && response.hasCaptcha && <Captcha captcha={response.captcha} />}
      </>
    );
  }
);
