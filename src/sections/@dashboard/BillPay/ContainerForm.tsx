import { useEffect, ReactNode } from 'react';
import { find } from 'lodash';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha, Box, Button, Card, Stack, Typography, Divider } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
import { fCurrency } from '../../../utils/formatNumber';
// components
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function ContainerForm({
  children,
  onBack,
  handleSubmit,
  step,
  payee,
  amount,
  remark,
  card,
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
  payee?: string | null;
  amount?: number;
  remark?: string;
  card?: string | null;
  disabledHandleSubmit?: boolean;
  setDisabledHandleSubmit: (value: boolean) => void;
  withFooter?: boolean;
  isLast?: boolean;
  isOTP?: boolean;
}) {
  const navigate = useNavigate();
  const isUpSm = useResponsive('up', 'sm');

  const { businessPayees, accounts } = useSelector((state) => state.accountState);

  const getPayee = () => find(businessPayees, ({ id }) => id === payee);

  const getAccount = () => find(accounts, ({ id }) => id === card);

  useEffect(() => {
    if (isUpSm) setDisabledHandleSubmit(true);
    // eslint-disable-next-line
  }, [isUpSm]);

  return (
    <>
      {isUpSm ? (
        <Typography
          variant="h4"
          color={(theme) => theme.palette.grey[900]}
          textAlign="center"
          mb={10}
        >
          Make a Payment
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
            Bill Pay
          </Typography>

          {!isLast && <Box width={38} />}
        </Stack>
      )}

      <Stack width="100%" maxWidth={950} mx="auto" flexGrow={1}>
        <Card
          sx={{
            display: 'flex',
            borderRadius: { xs: 0, sm: 2 },
            p: { xs: 0, sm: 6 },
            boxShadow: { xs: 'unset' },
            minHeight: { sm: 700 }
          }}
        >
          <Stack flexGrow={1} justifyContent="space-between">
            <Stack
              direction={{ xs: 'column', sm: isLast ? 'column' : 'row' }}
              justifyContent={isOTP ? 'center' : isLast ? 'flex-start' : 'space-between'}
              flexGrow={1}
              px={{ md: 3 }}
              mb={{ sm: 6 }}
              {...(isLast && { alignItems: 'center' })}
            >
              {!isOTP && (
                <>
                  {isLast && (
                    <>
                      <Stack mb={{ xs: 3, sm: 0 }} maxWidth={{ sm: 300, md: 320 }} width="100%">
                        <Box
                          width={24}
                          height={24}
                          mx="auto"
                          mb={2}
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
                          YOUR PAYMENT HAS BEEN COMPLETED
                        </Typography>
                      </Stack>
                    </>
                  )}

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
                      {!isLast ? 'Pay to' : 'Paid to'}
                    </Typography>

                    {!payee ? (
                      <Typography
                        variant="subtitle2"
                        fontFamily="Roboto"
                        color={(theme) => theme.palette.grey[700]}
                        mb={{ sm: 4 }}
                        px={1}
                      >
                        Select payee from the list below
                      </Typography>
                    ) : (
                      <Stack
                        direction="row"
                        color={(theme) => theme.palette.grey[900]}
                        justifyContent="space-between"
                        mb={{ xs: 2, sm: 4 }}
                        px={1}
                      >
                        <Stack>
                          <Typography variant="subtitle2">{getPayee()?.name}</Typography>
                          <Typography variant="body2">
                            Account Nº: <b>{getPayee()?.account}</b>
                          </Typography>
                        </Stack>

                        <Stack>
                          <Typography variant="body2" textTransform="capitalize">
                            {getPayee()?.type.toLowerCase()}
                          </Typography>
                        </Stack>
                      </Stack>
                    )}

                    {(isUpSm || !['PayTo', 'Amount'].includes(step)) && (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontFamily="Roboto"
                          color={(theme) =>
                            theme.palette.grey[!['PayTo'].includes(step) ? 900 : 300]
                          }
                          mb={!['PayTo'].includes(step) ? 1 : 4}
                        >
                          Amount
                        </Typography>

                        {!['PayTo'].includes(step) && (
                          <>
                            {!amount ? (
                              <Typography
                                variant="subtitle2"
                                fontFamily="Roboto"
                                color={(theme) => theme.palette.grey[700]}
                                mb={{ sm: 4 }}
                                px={1}
                              >
                                Enter an amount
                              </Typography>
                            ) : (
                              <Stack
                                color={(theme) => theme.palette.grey[900]}
                                px={1}
                                mb={{ xs: 2, sm: 4 }}
                              >
                                <Typography variant="subtitle2" fontSize={18}>
                                  {fCurrency(amount)}
                                </Typography>
                                <Typography variant="body2">Remark: {remark}</Typography>
                              </Stack>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {(isUpSm || !['PayTo', 'Amount', 'SelectAnAccount'].includes(step)) && (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontFamily="Roboto"
                          color={(theme) =>
                            theme.palette.grey[!['PayTo', 'Amount'].includes(step) ? 900 : 300]
                          }
                          mb={!['PayTo', 'Amount'].includes(step) ? 1 : 4}
                        >
                          {!isLast ? 'Pay from' : 'Paid from'}
                        </Typography>

                        {!['PayTo', 'Amount'].includes(step) && (
                          <>
                            {!card ? (
                              <Typography
                                variant="subtitle2"
                                fontFamily="Roboto"
                                color={(theme) => theme.palette.grey[700]}
                                mb={{ sm: 4 }}
                                px={1}
                              >
                                Select an account to pay from
                              </Typography>
                            ) : (
                              <Stack
                                direction="row"
                                color={(theme) => theme.palette.grey[900]}
                                justifyContent="space-between"
                                mb={{ xs: 2, sm: 4 }}
                                px={1}
                              >
                                <Stack direction="row">
                                  <Box width={24} height={24} mr={2}>
                                    {getIcon(
                                      (getAccount()?.type === 'saving' && 'ic_coint_light') ||
                                        (getAccount()?.type === 'checking' && 'ic_check_light') ||
                                        (getAccount()?.type === 'credit' && 'ic_card') ||
                                        'ic_investment_light'
                                    )}
                                  </Box>

                                  <Stack>
                                    <Typography variant="subtitle2">
                                      {(getAccount()?.type === 'saving' && 'Savings Account') ||
                                        (getAccount()?.type === 'checking' && 'Checking Account') ||
                                        (getAccount()?.type === 'credit' && 'Credit Card') ||
                                        'Investment Account'}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color={(theme) => theme.palette.grey[700]}
                                    >
                                      {getAccount()?.number}
                                    </Typography>
                                  </Stack>
                                </Stack>

                                <Stack color={(theme) => theme.palette.grey[900]}>
                                  <Typography variant="subtitle2" fontSize={16}>
                                    {fCurrency(getAccount()?.balance || 0)}
                                  </Typography>
                                </Stack>
                              </Stack>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {!isLast &&
                      (isUpSm ||
                        !['PayTo', 'Amount', 'SelectAnAccount', 'ConfirmAction'].includes(
                          step
                        )) && (
                        <>
                          <Typography
                            variant="subtitle2"
                            fontFamily="Roboto"
                            color={(theme) =>
                              theme.palette.grey[
                                !['PayTo', 'Amount', 'SelectAnAccount'].includes(step) ? 900 : 300
                              ]
                            }
                            mb={!['PayTo', 'Amount', 'SelectAnAccount'].includes(step) ? 1 : 4}
                          >
                            Confirm payment
                          </Typography>

                          {['ConfirmAction'].includes(step) && (
                            <Typography
                              variant="subtitle2"
                              fontFamily="Roboto"
                              color={(theme) => theme.palette.grey[700]}
                              mb={{ sm: 4 }}
                              px={1}
                            >
                              Enter received code
                            </Typography>
                          )}
                        </>
                      )}

                    {!isUpSm && !isLast && !['PayTo'].includes(step) && <Divider />}
                  </Stack>
                </>
              )}

              {!isLast && (
                <>
                  {!isOTP && (
                    <>{isUpSm && <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />}</>
                  )}

                  <Stack
                    pt={{ sm: !['PayTo'].includes(step) ? 7 : 0 }}
                    maxWidth={{ sm: 300, md: 320 }}
                    width="100%"
                  >
                    {children}
                  </Stack>
                </>
              )}
            </Stack>

            {!isOTP && (
              <>
                {(withFooter || isUpSm) && (
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
                    // mt={{ sm: 2 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ maxWidth: 330 }}
                      onClick={isLast ? () => navigate('/app', { replace: true }) : handleSubmit}
                      disabled={!disabledHandleSubmit}
                    >
                      <Typography
                        variant="subtitle1"
                        textAlign="center"
                        fontFamily="Roboto"
                        fontWeight={500}
                      >
                        {isLast ? 'OK' : ['ConfirmAction'].includes(step) ? 'CONFIRM' : 'CONTINUE'}
                      </Typography>
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
