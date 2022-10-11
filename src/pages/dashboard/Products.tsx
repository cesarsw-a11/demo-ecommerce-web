import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import MenuActions from '../../sections/@dashboard/MenuActions';

// ----------------------------------------------------------------------

const UlStyle = styled('ul')(({ theme }) => ({
  paddingLeft: 24,
  '& ::marker': {
    color: theme.palette.grey[900],
    fontSize: 12
  }
}));

// ----------------------------------------------------------------------

export default function Products() {
  const navigate = useNavigate();
  const isUpSm = useResponsive('up', 'sm');

  return (
    <Page title="Products">
      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={7}>
            <Box maxWidth={320} mx="auto">
              <Box maxWidth={300} mx="auto" mb={8}>
                <Image
                  src={require('../../assets/illustrations/illustration_credit_card_cyber_bank.png')}
                  alt="Logo"
                />
              </Box>

              <Typography
                variant="subtitle1"
                color={(theme) => theme.palette.grey[900]}
                maxWidth={245}
                mx="auto"
                textAlign="center"
              >
                Everyday Long Term Balance Transfer Credit Card
              </Typography>

              <Box maxWidth={280} mx="auto" mb={5}>
                <UlStyle>
                  <li
                    style={{
                      lineHeight: 1.2
                    }}
                  >
                    <Typography variant="caption" color={(theme) => theme.palette.grey[900]}>
                      0% interest on balance transfers for 31 months from account opening (2.75%
                      balance transfer fee applies, min $5).
                    </Typography>
                  </li>
                  <li
                    style={{
                      lineHeight: 1.2
                    }}
                  >
                    <Typography variant="caption" color={(theme) => theme.palette.grey[900]}>
                      0% interest on purchases for 3 months from account opening.
                    </Typography>
                  </li>
                  <li
                    style={{
                      lineHeight: 1.2
                    }}
                  >
                    <Typography variant="caption" color={(theme) => theme.palette.grey[900]}>
                      No monthly account fee.
                    </Typography>
                  </li>
                </UlStyle>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/app/products/apply-credit')}
              >
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  fontFamily="Roboto"
                  fontWeight={500}
                >
                  APPLY FOR CREDIT CARD
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>

        {!isUpSm && <MenuActions />}
      </Container>
    </Page>
  );
}
