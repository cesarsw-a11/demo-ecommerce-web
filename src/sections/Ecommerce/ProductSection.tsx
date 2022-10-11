
import ProductCard from '../../sections/Ecommerce/ProductCard';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Carousel from 'react-material-ui-carousel';

const productsItems_Women = ['product_1', 'product_2', 'product_3', 'product_4'];
const productsItems_Men = ['product_5', 'product_6', 'product_7', 'product_8'];

export default function ProductSection() {

    return (
        <>
            <Typography variant='h3' sx={{ color: 'black', mt: 3, mb: 2, ml: 2 }}>
                Women - New Arrivals
            </Typography>
            <Grid container justifyContent='space-between' sx={{ display: { sm: 'none', xs: 'block' } }} >
                <Carousel>
                    {productsItems_Women.map((item, key) => (
                        <ProductCard key={key} productName={item} />
                    ))}
                </Carousel>
            </Grid>
            <Grid container justifyContent='space-between' sx={{ display: { sm: 'flex', xs: 'none' } }} >
                {productsItems_Women.map((item, key) => (

                    <ProductCard key={key} productName={item} />
                ))}
            </Grid>
            <Typography variant='h3' sx={{ color: 'black', mt: 3, mb: 2, ml: 2 }}>
                Men - New Arrivals
            </Typography>
            <Grid container justifyContent='space-between' marginBottom={5} sx={{ display: { sm: 'none', xs: 'block' } }}>
                <Carousel>
                    {productsItems_Men.map((item, key) => (
                        <ProductCard key={key} productName={item} />
                    ))}
                </Carousel>
            </Grid>
            <Grid container justifyContent='space-between' marginBottom={5} sx={{ display: { sm: 'flex', xs: 'none' } }}>
                    {productsItems_Men.map((item, key) => (
                        <ProductCard key={key} productName={item} />
                    ))}
            </Grid>
        </>
    )
}