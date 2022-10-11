import { matchPath, useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, ButtonGroup, Button, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const ButtonAction = styled(Button)(({ theme }) => ({
  border: 'unset!important',
  borderRadius: 0
}));

// ----------------------------------------------------------------------

const getActive = (path: string, pathname: string) =>
  path ? !!matchPath({ path: path, end: true }, pathname) : false;

export default function MenuActions() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box position="fixed" width="100%" bottom={0} bgcolor={(theme) => theme.palette.common.white}>
      <ButtonGroup variant="text" fullWidth size="large">
        <ButtonAction
          onClick={() => navigate('/app/my-account')}
          {...(getActive('/app/my-account', pathname) && {
            sx: { borderTop: (theme) => `1px solid ${theme.palette.primary.main}!important` }
          })}
        >
          <Typography
            variant="subtitle2"
            color={(theme) =>
              getActive('/app/my-account', pathname)
                ? theme.palette.primary.main
                : theme.palette.grey[500]
            }
          >
            ACCOUNTS
          </Typography>
        </ButtonAction>

        <ButtonAction
          onClick={() => navigate('/app')}
          {...(getActive('/app/dashboard', pathname) && {
            sx: { borderTop: (theme) => `1px solid ${theme.palette.primary.main}!important` }
          })}
        >
          <Typography
            variant="subtitle2"
            color={(theme) =>
              getActive('/app/dashboard', pathname)
                ? theme.palette.primary.main
                : theme.palette.grey[500]
            }
          >
            DASHBORD
          </Typography>
        </ButtonAction>

        <ButtonAction
          onClick={() => navigate('/app/products')}
          {...(getActive('/app/products', pathname) && {
            sx: { borderTop: (theme) => `1px solid ${theme.palette.primary.main}!important` }
          })}
        >
          <Typography
            variant="subtitle2"
            color={(theme) =>
              getActive('/app/products', pathname)
                ? theme.palette.primary.main
                : theme.palette.grey[500]
            }
          >
            PRODUCTS
          </Typography>
        </ButtonAction>
      </ButtonGroup>
    </Box>
  );
}
