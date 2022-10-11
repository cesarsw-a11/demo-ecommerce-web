import { ReactNode } from 'react';
// @mui
import { alpha, Box, Button, Card, Stack, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import getIcon from '../../../utils/getIcon';
// components
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
  onBack?: () => void;
  handleSubmit?: () => void;
  disabledHandleSubmit?: boolean;
  isConfirm?: boolean;
  isLast?: boolean;
}) {
  const isUpSm = useResponsive('up', 'sm');

  return (
    <>
      {isUpSm ? (
        <Typography
          variant="h4"
          color={(theme) => theme.palette.grey[900]}
          textAlign="center"
          mb={10}
        >
          Apply for a Credit Card
        </Typography>
      ) : (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top={0}
          left={0}
          width={{ xs: '100%', md: '50%' }}
          height={56}
          px={2}
          bgcolor={(theme) => theme.palette.common.white}
          pt={(theme) => ({ xs: 0, sm: theme.spacing(3) })}
          zIndex={9}
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
            Apply for a Credit Card
          </Typography>

          {onBack && <Box width={38} />}
        </Stack>
      )}

      <Stack width="100%" maxWidth={950} mx="auto" flexGrow={1}>
        <Card
          sx={{
            display: 'flex',
            borderRadius: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 6 },
            boxShadow: { xs: 'unset' },
            minHeight: { sm: 700 },
            justifyContent: 'center'
          }}
        >
          <Stack flexGrow={1} justifyContent="space-between">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              flexGrow={1}
              px={{ md: 3 }}
              mb={{ sm: 6 }}
              {...(isLast && { alignItems: 'center' })}
            >
              <Stack maxWidth={{ sm: 300, md: 320 }} width="100%">
                {children}
              </Stack>
            </Stack>

            {handleSubmit && (
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
                  sx={{ maxWidth: 330 }}
                  disabled={!disabledHandleSubmit}
                >
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontFamily="Roboto"
                    fontWeight={500}
                  >
                    {isLast ? 'OK' : isConfirm ? 'APPLY FOR A CREDIT CARD' : 'CONTINUE'}
                  </Typography>
                </Button>
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
