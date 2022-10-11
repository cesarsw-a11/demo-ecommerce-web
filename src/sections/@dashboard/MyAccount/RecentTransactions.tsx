// @mui
import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// utils
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function RecentTransactions() {
  const isUpSm = useResponsive('up', 'sm');

  const { transactions } = useSelector((state) => state.accountState);

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        px: { xs: 1, sm: 5 },
        py: { sm: 4 },
        boxShadow: { xs: 'unset' },
        borderRadius: { xs: 0, sm: 2 },
        mt: (theme) => ({ sm: theme.spacing(4) })
      }}
    >
      <CardHeader
        title={
          <Typography
            fontFamily="Roboto"
            variant={isUpSm ? 'h5' : 'subtitle2'}
            color={(theme) => ({ xs: theme.palette.grey[700], sm: theme.palette.grey[900] })}
          >
            Recent Transactions
          </Typography>
        }
      />

      <CardContent>
        {transactions.map(({ name, balance, date }, index, { length }) => (
          <Stack
            key={index}
            direction="row"
            justifyContent="space-between"
            {...(index < length - 1 && { mb: 3 })}
          >
            <Typography
              fontFamily="Roboto"
              variant="subtitle2"
              color={(theme) => ({ xs: theme.palette.grey[900], sm: theme.palette.grey[700] })}
              {...(isUpSm && { fontSize: 18 })}
            >
              {name}
            </Typography>

            <Box textAlign="right">
              <Typography
                fontFamily="Roboto"
                variant="subtitle1"
                color={(theme) =>
                  balance > 0 ? theme.palette.success.main : theme.palette.grey[900]
                }
                {...(isUpSm && { fontSize: 18 })}
              >
                {fCurrency(balance)}
              </Typography>
              <Typography variant="body2" color={(theme) => theme.palette.grey[700]}>
                {fDate(date)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}
