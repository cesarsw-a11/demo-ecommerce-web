// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import getIcon from '../../../utils/getIcon';
import cssStyles from '../../../utils/cssStyles';
// config
import {
  DASHBOARD_NAVBAR_WIDTH,
  DASHBOARD_HEADER_MOBILE,
  DASHBOARD_HEADER_DESKTOP,
  DASHBOARD_NAVBAR_COLLAPSE_WIDTH
} from '../../../config';
// components
import { IconButtonAnimate } from '../../../components/animate';
// redux
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean | undefined;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse'
})<RootStyleProps>(({ isCollapse, theme }) => ({
  boxShadow: 'none',
  ...cssStyles(theme).bgBlur(),
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DASHBOARD_NAVBAR_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${DASHBOARD_NAVBAR_COLLAPSE_WIDTH}px)`
    })
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: DASHBOARD_HEADER_MOBILE,
  transition: theme.transitions.create('min-height', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 5),
    minHeight: DASHBOARD_HEADER_DESKTOP
  }
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardHeader({ onOpenSidebar }: Props) {
  const { isCollapse } = useCollapseDrawer();

  const isOffset = useOffSetTop(DASHBOARD_HEADER_DESKTOP);

  const isDesktop = useResponsive('up', 'lg');

  const { user } = useSelector((state) => state.nuDetectState);
  const username = user?.username || '';
  
  return (
    <RootStyle isCollapse={isCollapse}>
      <ToolbarStyle
        sx={{
          ...(isOffset && {
            minHeight: { md: DASHBOARD_HEADER_DESKTOP - 16 }
          })
        }}
      >
        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
              {getIcon('ic_menu')}
            </Box>
          </IconButtonAnimate>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {!isDesktop && (
          <Typography variant="subtitle1" noWrap color={(theme) => theme.palette.grey[900]}>
            {username}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {!isDesktop && (
          <IconButtonAnimate sx={{ mr: 1, color: 'text.primary' }}>
            <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
              {getIcon('ic_settings')}
            </Box>
          </IconButtonAnimate>
        )}
      </ToolbarStyle>
    </RootStyle>
  );
}
