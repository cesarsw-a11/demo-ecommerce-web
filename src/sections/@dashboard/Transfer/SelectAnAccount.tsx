import { useEffect, forwardRef, ChangeEvent, useImperativeHandle } from 'react';
// @mui
import { Box, Stack, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
import { fCurrency } from '../../../utils/formatNumber';
// types
import { NuDetectTransfer } from '../../../@types/NuDetect';
// utils
import Captcha, { getCaptchaValues } from '../../../sections/Captcha';

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit,
      card,
      setCard,
      amount,
      onTransfer
    }: {
      onNext: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      card: string | null;
      setCard: (_v: string | null) => void;
      amount: number;
      onTransfer: (_v: Partial<NuDetectTransfer>) => void;
    },
    ref: any
  ) => {
    const isUpSm = useResponsive('up', 'sm');

    const {
      accountState: { accounts },
      nuDetectState: { user, response }
    } = useSelector((state) => state);

    const handleSubmit = () => {
      // if (card) {
      const captcha = getCaptchaValues();

      onTransfer({
        username: user?.username || '',
        phoneNumber: user?.phoneNumber || '',
        amount: amount.toString(),
        ...(captcha && { captcha })
      });
      // }
    };

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      setDisabledHandleSubmit(true);
      // eslint-disable-next-line
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setCard((event.target as HTMLInputElement).value);
      if (!isUpSm) handleSubmit();
    };

    return (
      <>
        {isUpSm ? (
          <Typography
            variant="subtitle2"
            fontFamily="Roboto"
            fontSize={18}
            textAlign="center"
            color={(theme) => theme.palette.grey[900]}
            mb={7}
          >
            Select an Account
          </Typography>
        ) : (
          <Typography
            variant="subtitle2"
            fontFamily="Roboto"
            color={(theme) => theme.palette.grey[900]}
            mb={4}
          >
            Transfer from
          </Typography>
        )}

        <RadioGroup value={card} onChange={handleChange}>
          {accounts.map(({ id, type, balance, number }) => (
            <FormControlLabel
              key={id}
              value={id}
              control={<Radio />}
              disabled={amount > balance}
              onClick={() => !isUpSm && card && handleSubmit()}
              label={
                <Stack
                  direction="row"
                  color={(theme) => theme.palette.grey[amount > balance ? 700 : 900]}
                  justifyContent="space-between"
                  px={{ xs: 1, sm: 0 }}
                >
                  <Stack direction="row">
                    {!isUpSm && (
                      <Box width={24} height={24} mr={2}>
                        {getIcon(
                          (type === 'saving' && 'ic_coint_light') ||
                            (type === 'checking' && 'ic_check_light') ||
                            (type === 'credit' && 'ic_card') ||
                            'ic_investment_light'
                        )}
                      </Box>
                    )}
                    <Stack>
                      <Typography variant="subtitle2">
                        {(type === 'saving' && 'Savings Account') ||
                          (type === 'checking' && 'Checking Account') ||
                          (type === 'credit' && 'Credit Card') ||
                          'Investment Account'}
                      </Typography>
                      <Typography variant="body2" color={(theme) => theme.palette.grey[700]}>
                        {number}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack color={(theme) => theme.palette.grey[amount > balance ? 700 : 900]}>
                    <Typography variant="subtitle2" fontSize={16}>
                      {fCurrency(balance)}
                    </Typography>
                  </Stack>
                </Stack>
              }
              sx={{
                mx: 0,
                mb: 2.5,
                '& .MuiRadio-root': { display: { xs: 'none', sm: 'inline-flex' } },
                '& .MuiFormControlLabel-label': { flexGrow: 1 }
              }}
            />
          ))}
        </RadioGroup>

        {response && response.hasCaptcha && <Captcha captcha={response.captcha} />}
      </>
    );
  }
);
