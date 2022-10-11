
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

//icons
import ic_location from '../../../src/assets/icons/ic_location.svg';
import ic_instagram from '../../../src/assets/icons/ic_instagram.svg';
import ic_facebook from '../../../src/assets/icons/ic_facebook.svg';
import ic_twitter from '../../../src/assets/icons/ic_twitter.svg';
import ic_youtube from '../../../src/assets/icons/ic_youtube.svg';
import logo_black from '../../../src/assets/logo_black.png';

const Item = styled('h5')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Footer() {
    return (
        <Grid container spacing={2} sx={{
            backgroundColor: 'black', paddingTop: '1rem',
            paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '3rem', mt: 4, fontWeight: 100, fontSize: '18px'
        }}>
            <Box sx={{ display: { sm: 'none', xs: 'flex' } }} justifyContent='right' marginTop={2}>
                <img src={logo_black} alt="" width="100px" />
            </Box>
            <Grid item sm={3} xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 100, color: 'white', mb: 2 }}>Shop By Category</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Women</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Accesories</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>SALE</Typography>
            </Grid>
            <Grid item sm={3} xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 100, color: 'white', mb: 2 }}>About</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Contact Us</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>About Us</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Careers</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Press</Typography>
            </Grid>
            <Grid item sm={3} xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 100, color: 'white', mb: 2 }}>Policy</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Return Policy</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Terms of Use</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Sitemap</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Security</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>Privacy</Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: '#B6B6B6' }}>EPR Compliance</Typography>
            </Grid>
            <Grid marginTop='inherit'>
                <Box sx={{ display: { sm: 'flex', xs: 'none' } }} justifyContent='right'>
                    <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
                        <img src={ic_facebook} alt="" />
                    </IconButton>
                    <IconButton
                        size="large"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <img src={ic_instagram} alt="" />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-haspopup="true"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <img src={ic_twitter} alt="" />

                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-haspopup="true"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <img src={ic_youtube} alt="" />

                    </IconButton>
                </Box>
                <Box sx={{ display: { sm: 'flex', xs: 'none' } }} justifyContent='right' marginTop={2}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-haspopup="true"
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        <img src={ic_location} alt="" />

                    </IconButton>
                    <Typography variant='subtitle2' sx={{ fontWeight: 100, color: 'white', mb: 2 }}>
                        United States
                    </Typography>
                </Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 100, color: 'white', mb: 2 }}>
                    2022 | OVERLAP All Rights Reserver
                </Typography>
                <Box sx={{ display: { sm: 'flex', xs: 'none' } }} justifyContent='right' marginTop={2}>
                    <img src={logo_black} alt="" width="100px" />
                </Box>
            </Grid>
        </Grid>
    )
}