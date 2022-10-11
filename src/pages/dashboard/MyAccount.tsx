import { useEffect } from 'react';
// @mui
import { Box, Container, Divider, Grid } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// redux
import { useDispatch } from '../../redux/store';
import { setHistory } from '../../redux/slices/NuDetect';
// components
import Page from '../../components/Page';
// sections
import {
  Carousel,
  MenuActions,
  ActionsMobile,
  SpendingReport,
  ActionsDesktop,
  RecentTransactions
} from '../../sections/@dashboard/MyAccount';

// ----------------------------------------------------------------------

export default function MyAccount() {
  const dispatch = useDispatch();
  const isUpSm = useResponsive('up', 'sm');
  const isUpMd = useResponsive('up', 'md');

  useEffect(() => {
    dispatch(setHistory('screen', 'Home', 'Home', {}));
    // eslint-disable-next-line
  }, []);

  const actions = [
    {
      name: 'Transfer',
      icon: 'ic_transfer',
      path: '/app/my-account/transfer'
    },
    {
      name: 'Bill Pay',
      icon: 'ic_bill_pay',
      path: '/app/my-account/bill-pay'
    },
    {
      name: 'Pay Wallet',
      icon: 'pay_wallet',
      path: ''
    },
    {
      name: 'Deposit Check',
      icon: 'ic_deposit_check',
      path: ''
    }
  ];

  return (
    <Page title="My Account">
      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Carousel />

            {!isUpMd && <ActionsMobile actions={actions} />}

            {!isUpMd && (
              <Box px={3} py={2}>
                <Divider sx={{ borderColor: (theme) => theme.palette.grey[300] }} />
              </Box>
            )}

            {isUpSm && <SpendingReport />}

            <RecentTransactions />
          </Grid>

          {isUpMd && <ActionsDesktop actions={actions} />}
        </Grid>

        {!isUpSm && <MenuActions />}
      </Container>
    </Page>
  );
}
