import { ReactNode } from 'react';
// @mui
import { alpha, Box, Button, Stack, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Image from '../../../components/Image';
import { IconButtonAnimate } from '../../../components/animate';

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
  const isUpSm = useResponsive('up', 'sm');

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        position={{ xs: 'fixed', sm: 'unset' }}
        top={0}
        left={0}
        width="100%"
        height={56}
        px={2}
        bgcolor={(theme) => theme.palette.common.white}
        pt={(theme) => ({ xs: 0, sm: theme.spacing(3) })}
        zIndex={9}
      >
        <IconButtonAnimate onClick={onBack} sx={{ color: 'text.primary' }}>
          <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
            {getIcon('ic_back')}
          </Box>
        </IconButtonAnimate>

        <Typography
          flexGrow={1}
          variant="subtitle1"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          Sign Up
        </Typography>

        <Box width={38} />
      </Stack>

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
              {isLast ? 'OK' : isConfirm ? 'CONFIRM' : 'CONTINUE'}
            </Typography>
          </Button>
        </Stack>
      </Stack>

      {isUpSm && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          // position="fixed"
          bottom={0}
          left={0}
          width="100%"
          pb={(theme) => theme.spacing(7)}
          bgcolor={(theme) => theme.palette.common.white}
          zIndex={9}
        >
          <Image src={require('../../../assets/logo.png')} alt="Logo" />
        </Stack>
      )}
    </>
  );
}
