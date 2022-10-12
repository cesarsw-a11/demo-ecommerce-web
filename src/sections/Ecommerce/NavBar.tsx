import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import logo from '../../../src/assets/logo.png';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import shoppingBag from '../../../src/assets/icons/ic_shoppingBag.svg';
import userBorder from '../../../src/assets/icons/ic_userBorder.svg';
import ic_bell from '../../../src/assets/icons/ic_bell.svg';
import moreIcon from '../../../src/assets/icons/ic_more.svg';
import searchIcon from '../../../src/assets/icons/ic_search_ecommerce.svg';
import { useNavigate } from 'react-router-dom';



interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#F1F1F1',
    '&:hover': {
        backgroundColor: '#e8e8e8',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '362px'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '362px'
    },
}));
const drawerWidth = 240;
const navItems = ['Women', 'Men', 'Accesories', 'SALE'];


export default function NavBar(props: Props) {
    const { window } = props;

    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const container = window !== undefined ? () => window().document.body : undefined;

    const menuId = 'primary-search-account-menu';

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const backHome = () => {
        navigate('/');
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ color: 'black', backgroundColor: 'white' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton onClick={backHome}>
                        <img src={logo} alt="overlap" width="100px" />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item} sx={{
                                color: 'black', fontSize: '1rem', ml: 2, fontWeight: 100,
                                '&:hover': {
                                    backgroundColor: '#F0F0F0',
                                    boxShadow: 'none',
                                }
                            }}>
                                {item}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Search sx={{ display: { sm: 'flex', xs: 'none' } }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search for products or brands...."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ display: { sm: 'flex', xs: 'none' } }}>
                        <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <img src={shoppingBag} alt="" />
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <img src={userBorder} alt="" />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { sm: 'none', xs: 'flex' } }}>
                        <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
                            <img src={moreIcon} alt="" />
                        </IconButton>
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <img src={searchIcon} alt="" />
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <img src={ic_bell} alt="" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
