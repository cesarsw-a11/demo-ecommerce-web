import { Fragment } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader, Divider } from '@mui/material';
//
import { NavSectionProps } from './type';
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.grey[700],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter
  }),
  fontFamily: 'Roboto',
  fontWeight: 400
}));

// ----------------------------------------------------------------------

export default function NavSection({ NavConfig, isCollapse = false, ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      {NavConfig.map((group, index, { length }) => (
        <Fragment key={index}>
          <List disablePadding sx={{ px: 1, py: 2 }}>
            {!isCollapse && group.subheader && (
              <ListSubheaderStyle
                // sx={{
                //   ...(isCollapse && {
                //     opacity: 0
                //   })
                // }}
              >
                {group.subheader}
              </ListSubheaderStyle>
            )}

            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
            ))}
          </List>
          {index < length - 1 && (
            <Divider sx={{ borderColor: (theme) => theme.palette.grey[300] }} />
          )}
        </Fragment>
      ))}
    </Box>
  );
}
