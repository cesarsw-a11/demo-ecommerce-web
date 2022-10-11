import { useEffect, ReactNode } from 'react';
// @mui
import { alpha, Box, Button, Card, Stack, Typography, Divider, Paper } from '@mui/material';
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
  step,
  openDialog,
  disabledHandleSubmit,
  setDisabledHandleSubmit,
  withFooter,
  isLast,
  isOTP
}: {
  children: ReactNode;
  onBack: () => void;
  handleSubmit: () => void;
  step: string;
  openDialog?: boolean;
  disabledHandleSubmit?: boolean;
  setDisabledHandleSubmit: (value: boolean) => void;
  withFooter?: boolean;
  isLast?: boolean;
  isOTP?: boolean;
}) {
  const isUpSm = useResponsive('up', 'sm');

  useEffect(() => {
    if (isUpSm) setDisabledHandleSubmit(true);
    // eslint-disable-next-line
  }, [isUpSm]);

  return (
    <>
      {isUpSm && <Box py={7} />}

      {!isOTP && (
        <>
          {!isUpSm && (
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
              {!isLast && (
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
                Personal and contact info
              </Typography>

              {!isLast && <Box width={38} />}
            </Stack>
          )}
        </>
      )}

      <Stack width="100%" maxWidth={950} mx="auto" flexGrow={1}>
        <Card
          sx={{
            display: 'flex',
            position: 'relative',
            borderRadius: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 6 },
            boxShadow: { xs: 'unset' },
            minHeight: { sm: 700 }
          }}
        >
          <Stack flexGrow={1} justifyContent="space-between">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent={isOTP ? 'center' : 'space-between'}
              flexGrow={1}
              px={{ md: 3 }}
              mb={{ sm: 6 }}
              // {...(isLast && { alignItems: 'center' })}
            >
              {!isOTP && (
                <>
                  {isUpSm && (
                    <Stack
                      mb={{ xs: 3, sm: 0 }}
                      pt={{ xs: isLast ? 7 : 0, sm: 7 }}
                      maxWidth={{ sm: 300, md: 320 }}
                      width="100%"
                    >
                      <Typography
                        variant="subtitle2"
                        fontFamily="Roboto"
                        color={(theme) => theme.palette.grey[900]}
                        mb={1}
                      >
                        Personal and contact info
                      </Typography>
                    </Stack>
                  )}

                  {isUpSm && <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />}
                </>
              )}

              <Stack pt={{ sm: 7 }} maxWidth={{ sm: 300, md: 320 }} width="100%">
                {children}
              </Stack>
            </Stack>

            {withFooter && (
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
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ maxWidth: 330 }}
                  onClick={handleSubmit}
                  disabled={openDialog}
                >
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontFamily="Roboto"
                    fontWeight={500}
                  >
                    {['ConfirmPayeeToAdd'].includes(step) ? 'ADD' : 'CONTINUE'}
                  </Typography>
                </Button>
              </Stack>
            )}
          </Stack>

          {openDialog && (
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                py: 3,
                px: 2,
                width: '100%',
                maxWidth: 280,
                boxShadow: (theme) =>
                  `0px 0px 2px ${alpha(theme.palette.grey[500], 0.24)}, 0px 12px 24px ${alpha(
                    theme.palette.grey[500],
                    0.24
                  )}`
              }}
            >
              <Box
                width={30}
                height={30}
                mx="auto"
                mb={2}
                color={(theme) => theme.palette.success.main}
              >
                {getIcon('ic_done_light')}
              </Box>
              <Typography
                variant="subtitle2"
                textAlign="center"
                color={(theme) => theme.palette.grey[900]}
              >
                {(step === 'ContactInfo' && 'THE CONTACT INFO WAS UPDATED SUCCESSFULLY') ||
                  (step === 'PersonalInfo' && 'THE PERSONAL INFO WAS UPDATED SUCCESSFULLY') ||
                  ''}
              </Typography>
            </Paper>
          )}
        </Card>
      </Stack>
    </>
  );
}
