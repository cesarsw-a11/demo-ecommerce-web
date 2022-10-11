import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Paper from '@mui/material/Paper';

import ic_shoppingBag from '../../../src/assets/icons/ic_shoppingBag.svg';
import ic_userBorder from '../../../src/assets/icons/ic_userBorder.svg';
import ic_home from '../../../src/assets/icons/ic_home.svg';
import ic_categories from '../../../src/assets/icons/ic_categories.svg';

export default function MobileBottomNav() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{justifyContent: 'space-around', position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'none', xs: 'flex' }}} elevation={3}>
    <BottomNavigation  value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<img src={ic_home}/>}
      />
      <BottomNavigationAction
        label="Categories"
        value="categories"
        icon={<img src={ic_categories}/>}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<img src={ic_userBorder}/>}
      />
      <BottomNavigationAction label="Bag" value="bag" icon={<img src={ic_shoppingBag}/>} />
    </BottomNavigation>
    </Paper>
  );
}
