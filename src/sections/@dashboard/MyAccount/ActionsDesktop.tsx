import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Button, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

const BoxActions = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: 'repeat(2, 1fr)'
}));

const ButtonAction = styled(Button)(({ theme }) => ({
  width: 160,
  height: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  padding: theme.spacing(4.5, 1, 1),
  backgroundColor: theme.palette.common.white,
  border: 'unset'
}));

// ----------------------------------------------------------------------

export default function ActionsDesktop({
  actions
}: {
  actions: {
    name: string;
    icon: string;
    path: string;
  }[];
}) {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} md="auto">
      <Typography variant="h4" color="#5D5FEF" mb={2}>
        Actions
      </Typography>

      <BoxActions>
        {actions.map(({ name, icon, path }) => (
          <ButtonAction key={name} variant="outlined" onClick={() => navigate(path)}>
            <Box width={40} height={40} color={(theme) => theme.palette.grey[900]} mx="auto" mb={2}>
              {getIcon(icon)}
            </Box>

            <Typography
              variant="h4"
              textAlign="center"
              lineHeight={1.2}
              color={(theme) => theme.palette.grey[700]}
            >
              {name}
            </Typography>
          </ButtonAction>
        ))}
      </BoxActions>
    </Grid>
  );
}
