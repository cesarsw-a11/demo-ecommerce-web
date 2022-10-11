import { ReactNode } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Link,
  LinkProps,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  ListItemButtonProps
} from '@mui/material';
// config
import {
  DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT,
  DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT,
  DASHBOARD_NAVBAR_ICON_ITEM_SIZE
} from '../../config';
//
import Image from '../Image';
// type
import { NavItemProps } from './type';
//
import IcArrowRight from '../../assets/icons/ic_arrow_right.svg';

// ----------------------------------------------------------------------

type IProps = LinkProps & ListItemButtonProps;

interface ListItemStyleProps extends IProps {
  component?: ReactNode;
  to?: string;
  activeRoot?: boolean;
  activeSub?: boolean;
  subItem?: boolean;
}

const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'activeRoot' && prop !== 'activeSub' && prop !== 'subItem'
})<ListItemStyleProps>(({ activeRoot, activeSub, subItem, theme }) => ({
  ...theme.typography.body2,
  position: 'relative',
  height: DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT,
  // textTransform: 'capitalize',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  // activeRoot
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    // backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    fontFamily: 'Roboto',
    fontWeight: 800
  }),
  // activeSub
  ...(activeSub && {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary
  }),
  // subItem
  ...(subItem && {
    height: DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT
  })
}));

interface ListItemTextStyleProps extends ListItemButtonProps {
  isCollapse?: boolean;
}

const ListItemTextStyle = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'isCollapse'
})<ListItemTextStyleProps>(({ isCollapse, theme }) => ({
  whiteSpace: 'nowrap',
  transition: theme.transitions.create(['width', 'opacity'], {
    duration: theme.transitions.duration.shorter
  }),
  ...(isCollapse && {
    width: 0,
    opacity: 0
  })
}));

const ListItemIconStyle = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'activeRoot'
})<ListItemStyleProps>(({ activeRoot, theme }) => ({
  width: DASHBOARD_NAVBAR_ICON_ITEM_SIZE,
  height: DASHBOARD_NAVBAR_ICON_ITEM_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[900],
  '& svg': { width: '100%', height: '100%' },
  ...(activeRoot && {
    color: theme.palette.primary.main
  })
}));

// ----------------------------------------------------------------------

const isExternalLink = (path: string) => path.includes('http');

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }: NavItemProps) {
  const { title, path, icon, info, children } = item;

  const renderContent = (
    <>
      {icon && <ListItemIconStyle activeRoot={active}>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info && info}
          {/* {children && <ArrowIcon open={open} />} */}
        </>
      )}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

type NavItemSubProps = Omit<NavItemProps, 'isCollapse'>;

export function NavItemSub({ item, open = false, active, onOpen }: NavItemSubProps) {
  const { title, path, info, children, icon } = item;

  const renderContent = (
    <>
      {icon && <ListItemIconStyle activeRoot={active}>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem sx={{ pl: 4 }}>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean;
};

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main'
          })
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

type ArrowIconProps = {
  open: boolean;
};

export function ArrowIcon({ open }: ArrowIconProps) {
  return <Image src={IcArrowRight} />;
}
