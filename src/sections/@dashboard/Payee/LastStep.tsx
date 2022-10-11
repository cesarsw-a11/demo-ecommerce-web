import { forwardRef, useImperativeHandle } from 'react';
// @mui
import { Box, Typography, Stack } from '@mui/material';
// hooks
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      onBack,
      setDisabledHandleSubmit,
      payee
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
    },
    ref: any
  ) => {
    const handleSubmit = () => {
      onNext();
    };

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    return (
      <>
        <Stack mb={{ xs: 5 }} maxWidth={{ sm: 300, md: 320 }} width="100%">
          <Box
            width={24}
            height={24}
            mx="auto"
            mb={4}
            color={(theme) => theme.palette.success.main}
          >
            {getIcon('ic_done_light')}
          </Box>

          <Typography
            variant="subtitle2"
            textAlign="center"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
            maxWidth={160}
            mx="auto"
          >
            THE PAYEE WAS SUCCESSFULLY ADDED
          </Typography>
        </Stack>

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
      </>
    );
  }
);
