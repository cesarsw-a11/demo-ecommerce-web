import { ReactNode } from 'react';
// @mui
import { alpha, Button, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ContainerForm({
  children,
  onBack,
  handleSubmit,
  disabledHandleSubmit,
  isConfirm,
  isLast
}: {
  children: ReactNode;
  onBack: () => void;
  handleSubmit: () => void;
  disabledHandleSubmit?: boolean;
  isConfirm?: boolean;
  isLast?: boolean;
}) {
  return (
    <>
      <Stack
        width="100%"
        maxWidth={330}
        mx="auto"
        justifyContent={{ xs: isLast ? 'center' : 'start', sm: 'space-evenly' }}
        flexGrow={1}
      >
        {children}

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
            onClick={handleSubmit}
            disabled={!disabledHandleSubmit}
          >
            <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto" fontWeight={500}>
              {isLast ? 'OK' : isConfirm ? 'CHANGE' : 'CONTINUE'}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
