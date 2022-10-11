import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Image from '../../../components/Image';

// ----------------------------------------------------------------------

const Dot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(1),
  minWidth: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%'
}));

// ----------------------------------------------------------------------

export default function StartStep({ onNext }: { onNext: () => void }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    onNext();
  };

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={10}>
        <Image src={require('../../../assets/logo.png')} alt="Logo" />
      </Stack>

      <Stack spacing={4.5} mb={10}>
        <Typography
          variant="caption"
          textAlign="center"
          fontWeight={300}
          fontSize={15}
          color={(theme) => theme.palette.grey[700]}
          maxWidth={310}
          mx="auto"
        >
          Welcome to Cyber Bank's mobile banking app. If you are already a customer with an existing
          bank card, you can sign up below for mobile access.
        </Typography>

        <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
          <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto" fontWeight={500}>
            SIGN UP
          </Typography>
        </Button>

        <Typography
          variant="caption"
          textAlign="center"
          fontWeight={300}
          color={(theme) => theme.palette.grey[700]}
        >
          Do you already have an account?{' '}
          <Link
            variant="overline"
            component={RouterLink}
            to="/signin"
            replace
            fontFamily="Roboto"
            fontWeight={800}
            sx={{ textTransform: 'unset', textDecoration: 'unset' }}
          >
            Sign In
          </Link>
        </Typography>

        <Button fullWidth variant="text" size="large" onClick={() => navigate('/apply-credit')}>
          <Typography variant="subtitle1" textAlign="center" fontFamily="Roboto" fontWeight={500}>
            APPLY FOR A CREDIT CARD
          </Typography>
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        position={{ xs: 'fixed', sm: 'relative' }}
        bottom={{ xs: 0, sm: 'unset' }}
        left={{ xs: 0, sm: 'unset' }}
        width={{ xs: '100%', sm: 'unset' }}
        height={{ xs: 66, sm: 'unset' }}
        px={{ xs: 1, sm: 'unset' }}
        bgcolor={(theme) => ({ xs: theme.palette.common.white, sm: 'unset' })}
      >
        <Typography
          variant="caption"
          fontFamily="Roboto"
          fontWeight={800}
          color={(theme) => theme.palette.grey[500]}
        >
          LOCATIONS
        </Typography>

        <Dot />

        <Typography
          variant="caption"
          fontFamily="Roboto"
          fontWeight={800}
          color={(theme) => theme.palette.grey[500]}
        >
          HELP
        </Typography>

        <Dot />

        <Typography
          variant="caption"
          fontFamily="Roboto"
          fontWeight={800}
          color={(theme) => theme.palette.grey[500]}
        >
          CONTACTS US
        </Typography>

        <Dot />

        <Typography
          variant="caption"
          fontFamily="Roboto"
          fontWeight={800}
          color={(theme) => theme.palette.grey[500]}
        >
          PRIVACY POLICY
        </Typography>
      </Stack>
    </>
  );
}
