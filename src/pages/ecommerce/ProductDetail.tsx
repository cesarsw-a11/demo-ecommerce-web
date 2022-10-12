
import { useLocation } from 'react-router-dom';
// components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FilledInput from '@mui/material/FilledInput';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
//Images
import product_1 from '../../../src/assets/illustrations/products/product_1.png';
import product_2 from '../../../src/assets/illustrations/products/product_2.png';
import product_3 from '../../../src/assets/illustrations/products/product_3.png';
import product_4 from '../../../src/assets/illustrations/products/product_4.png';

import ic_view_similars from '../../../src/assets/icons/ic_view_similars.svg';
import ic_arrow_right from '../../../src/assets/icons/ic_arrow_right.svg';
import ic_arrow_down from '../../../src/assets/icons/ic_arrow_down.svg';
import ic_shoppingBag_white from '../../../src/assets/icons/ic_shoppingBag_white.svg';

import '../../customStyles/productDetail.css';



export default function ProductDetail() {
    const location = useLocation();
    const productos = [product_1, product_2, product_3, product_4];
    const productId = location.state.id;

    return (
        <Grid container spacing={2} sx={{
            paddingBottom: '3rem', mt: 4, fontWeight: 100, fontSize: '18px'
        }}>
            <Grid item sm={3} xs={12}>
                <Card>
                    <ButtonBase sx={{ display: 'block' }}>
                        <img src={productos[productId]} />
                    </ButtonBase>
                    <Typography variant='subtitle1' sx={{ color: 'black' }}>
                        <IconButton sx={{ ml: '80%' }}>
                            <img src={ic_view_similars} alt="" />
                        </IconButton>
                    </Typography>
                </Card>
            </Grid>
            <Grid item sm={9} xs={12}>
                <Box sx={{ margin: { sm: 3, xs: 0 } }}>
                    <Typography variant='subtitle1' sx={{ color: 'black' }}>
                        Blue dress
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: 'black', fontWeight: 100 }}>
                        Fall collection
                    </Typography>
                    <Typography variant='subtitle1' sx={{ color: 'black' }}>
                        $54.69
                    </Typography>
                    <Card sx={{ mt: 2, display: 'flex' }}>
                        <Grid item sm={8} xs={8} margin={2}>
                            <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 100 }}>
                                Get upto 30% Off on order
                                value above $100
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                                Terms & Conditions
                            </Typography>

                        </Grid>
                        <Grid item sm={4} xs={4} margin={2}>
                            <Card sx={{ backgroundColor: 'lightgray', color: 'black', padding: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                                    Use Code
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 100 }}>
                                    ORDER100
                                </Typography>

                            </Card>
                        </Grid>
                    </Card>
                    <Card sx={{ mt: 2, color: 'black', padding: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 600 }}>
                            Delivery Details
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                            Check estimated delivery date/pickup option
                        </Typography>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
                            <InputLabel htmlFor="filled-adornment-password" sx={{ color: 'black', fontWeight: 100 }}>Enter Valid Pincode</InputLabel>
                            <FilledInput
                                id="filled-adornment-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                                            CHECK
                                        </Typography>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Card>
                    <Card sx={{ mt: 2, color: 'black', padding: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 600 }}>
                            Product Description
                            <IconButton sx={{ ml: "45%", display: { sm: 'none' } }}>
                                <img src={ic_arrow_down} alt="" />
                            </IconButton>
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                            Floral dresses for women make for perennial wardobe staples any time of year. From a lightweight summer flowe dress
                            to winter velvet maxi, our edit floral dresses has a silhouette to suit a gamut of shapes and styles.
                        </Typography>
                    </Card>
                    <Card sx={{ mt: 2, color: 'black', padding: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 600 }}>
                            Ratings & Reviews
                            <IconButton sx={{ ml: "45%", display: { sm: 'none' } }}>
                                <img src={ic_arrow_right} alt="" />
                            </IconButton>
                        </Typography>
                    </Card>
                    <Card sx={{ mt: 2, display: 'flex' }}>
                        <Grid item sm={8} xs={8} margin={2}>
                            <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 600 }}>
                                Invite Friends & Earn
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'black', fontWeight: 100 }}>
                                Get uptp 100 rewards points for every friend you invite
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 600, display: 'flex' }}>
                                Invite Now
                                <ArrowForwardIcon />
                            </Typography>

                        </Grid>
                        <Grid item sm={4} xs={4} margin={2}>
                            <Card sx={{ height: 100, backgroundColor: '#FFE6CA', color: 'black', padding: 1, display: { sm: 'none' } }}>

                            </Card>
                        </Grid>
                    </Card>
                </Box>
            </Grid>
            <Card sx={{padding: 1, justifyContent: 'space-around', position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'none', xs: 'flex' } }}>
                <Grid item xs={2}>
                    <Button className='bottomNavDetail' sx={{ backgroundColor: '#F4F4F4', color: 'black', width: '100%'}} startIcon={
                        <FavoriteBorderIcon/>
                    }>
                    </Button >
                </Grid>
                <Grid item xs={9} >
                    <Button className='bottomNavDetail' sx={{ backgroundColor: '#333333', color: 'white', width: '100%'}} startIcon={
                        <img src={ic_shoppingBag_white} />
                    }>
                        Add to Bag
                    </Button >
                </Grid>
            </Card>

        </Grid>
    )
}