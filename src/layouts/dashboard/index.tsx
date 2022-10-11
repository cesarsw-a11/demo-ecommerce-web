import { useState } from 'react';
import { Outlet, matchPath, useLocation, Navigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// redux
import { useSelector } from '../../redux/store';
// config
import {
  DASHBOARD_NAVBAR_WIDTH,
  DASHBOARD_HEADER_MOBILE,
  DASHBOARD_NAVBAR_COLLAPSE_WIDTH
} from '../../config';
//
import DashboardHeader from './header';
import DashboardNavbar from './navbar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    // minHeight: '100%',
    minHeight: '100vh'
  }
}));

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick'
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: DASHBOARD_HEADER_MOBILE + 24,
  paddingBottom: DASHBOARD_HEADER_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: DASHBOARD_HEADER_MOBILE - 14,
    paddingBottom: DASHBOARD_HEADER_MOBILE - 14,
    width: `calc(100% - ${DASHBOARD_NAVBAR_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter
    }),
    ...(collapseClick && {
      marginLeft: DASHBOARD_NAVBAR_COLLAPSE_WIDTH
    })
  }
}));

// ----------------------------------------------------------------------

const getActive = (path: string, pathname: string) =>
  path ? !!matchPath({ path: path, end: true }, pathname) : false;

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const { collapseClick } = useCollapseDrawer();

  const visibleDashboardHeader =
    getActive('/app/my-account', pathname) || getActive('/app/products', pathname);

  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.nuDetectState);

  if (!user) return <Navigate to="/" />;

  return (
    <RootStyle>
      {!isDesktop && visibleDashboardHeader && (
        <DashboardHeader onOpenSidebar={() => setOpen(true)} />
      )}

      <DashboardNavbar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
