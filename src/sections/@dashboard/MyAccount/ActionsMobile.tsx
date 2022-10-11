import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Button, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';
// components
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

const ButtonAction = styled(Button)(({ theme }) => ({
  minWidth: 80,
  maxWidth: 80,
  height: 124,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  padding: theme.spacing(2, 0.5),
  backgroundColor: 'transparent',
  border: 'unset'
}));

// ----------------------------------------------------------------------

export default function ActionsMobile({
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
    <Scrollbar
      sx={{
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', sm: 'space-around' },
        py: 1
      }}
    >
      <Stack direction="row">
        {actions.map(({ name, icon, path }) => (
          <ButtonAction
            key={name}
            variant="outlined"
            sx={{ mx: 0.25 }}
            onClick={() => navigate(path)}
          >
            <Stack
              width={44}
              minWidth={44}
              minHeight={44}
              bgcolor={(theme) => theme.palette.grey[100]}
              border={(theme) => `1px solid ${theme.palette.grey[300]}`}
              borderRadius={1}
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={2}
            >
              <Box width={24} height={24} color={(theme) => theme.palette.grey[900]}>
                {getIcon(icon)}
              </Box>
            </Stack>

            <Typography
              fontFamily="Roboto"
              variant="subtitle2"
              textAlign="center"
              lineHeight={1.2}
              color={(theme) => theme.palette.grey[700]}
            >
              {name}
            </Typography>
          </ButtonAction>
        ))}
      </Stack>
    </Scrollbar>
  );
}
