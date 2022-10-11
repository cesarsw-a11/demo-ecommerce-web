import { useEffect, ReactNode } from 'react';
import { useLocation, NavLink as RouterLink } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  LinkProps,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemButtonProps,
  Typography,
  Divider
} from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// redux
import { cleanUser, cleanRespose } from '../../../redux/slices/NuDetect';
import { useDispatch } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
import cssStyles from '../../../utils/cssStyles';
// config
import { DASHBOARD_NAVBAR_WIDTH, DASHBOARD_NAVBAR_COLLAPSE_WIDTH } from '../../../config';
// components
import Scrollbar from '../../../components/Scrollbar';
import NavSection from '../../../components/nav-section';
// redux
import { useSelector } from '../../../redux/store';
//
import NavConfig from './NavConfig';
// import CollapseButton from './CollapseButton';

// ----------------------------------------------------------------------

type IProps = LinkProps & ListItemButtonProps;

interface ListItemStyleProps extends IProps {
  component?: ReactNode;
  to?: string;
  replace?: boolean;
}

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter
    })
  }
}));

const ListItemStyle = styled(ListItemButton)<ListItemStyleProps>(({ theme }) => ({
  position: 'relative',
  height: 48,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.grey[900],
  borderTop: `1px solid ${theme.palette.grey[300]}`
}));

const ListItemIconStyle = styled(ListItemIcon)<ListItemStyleProps>(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[900],
  '& svg': { width: '100%', height: '100%' }
}));

const ListItemTextStyle = styled(ListItemText)<ListItemButtonProps>(({ theme }) => ({
  ...theme.typography.subtitle2,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create(['width', 'opacity'], {
    duration: theme.transitions.duration.shorter
  }),
  '& span': {
    fontWeight: 800,
    letterSpacing: 0.1
  }
}));

const LogOut = ({ onClick }: { onClick: () => void }) => {
  const { isCollapse } = useCollapseDrawer();

  return (
    <ListItemStyle
      component={RouterLink}
      to="/"
      replace
      onClick={onClick}
      sx={{ ...(isCollapse && { overflow: 'hidden' }) }}
    >
      <ListItemIconStyle>{getIcon('ic_logout')}</ListItemIconStyle>
      <ListItemTextStyle sx={{ ...(isCollapse && { width: 0, opacity: 0 }) }}>
        Log Out
      </ListItemTextStyle>
    </ListItemStyle>
  );
};

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function DashboardNavbar({ isOpenSidebar, onCloseSidebar }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const { user } = useSelector((state) => state.nuDetectState);
  const username = user?.username || '';

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    // onToggleCollapse,
    onHoverEnter,
    onHoverLeave
  } = useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
        ...(isDesktop && isCollapse && { overflow: 'hidden' })
      }}
    >
      <Box sx={{ pt: 5, pb: 2, px: 2.5 }}>
        <Typography variant="h5" noWrap color={(theme) => theme.palette.secondary.main}>
          {username}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: (theme) => theme.palette.grey[300] }} />

      <NavSection NavConfig={NavConfig} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderExtra = (
    <LogOut
      onClick={() => {
        dispatch(cleanRespose());
        dispatch(cleanUser());
      }}
    />
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? DASHBOARD_NAVBAR_COLLAPSE_WIDTH : DASHBOARD_NAVBAR_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: DASHBOARD_NAVBAR_WIDTH } }}
        >
          {renderContent}

          {renderExtra}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DASHBOARD_NAVBAR_WIDTH,
              bgcolor: (theme) => theme.palette.grey[0],
              borderColor: theme.palette.grey[300],
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard
                }),
              ...(isCollapse && {
                width: DASHBOARD_NAVBAR_COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur()
                // boxShadow: (theme) => theme.customShadows.z24
              })
            }
          }}
        >
          {renderContent}

          {renderExtra}
        </Drawer>
      )}
    </RootStyle>
  );
}
