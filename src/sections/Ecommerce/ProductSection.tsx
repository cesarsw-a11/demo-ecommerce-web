
import ProductCard from '../../sections/Ecommerce/ProductCard';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const productsItems_Women = ['product_1', 'product_2', 'product_3', 'product_4'];
const productsItems_Men = ['product_5', 'product_6', 'product_7', 'product_8'];

export default function ProductSection() {

    return (
        <>
            <Typography variant='h3' sx={{ color: 'black', mt: 3, mb: 2, ml: 2 }}>
                Women - New Arrivals
            </Typography>
            <Grid container justifyContent='space-between' >
                {productsItems_Women.map((item, key) => (
                    <ProductCard key={key} productName={item} />
                ))}
            </Grid>
            <Typography variant='h3' sx={{ color: 'black', mt: 3, mb: 2, ml: 2 }}>
                Men - New Arrivals
            </Typography>
            <Grid container justifyContent='space-between' marginBottom={5}>
                {productsItems_Men.map((item, key) => (
                    <ProductCard key={key} productName={item} />
                ))}
            </Grid>
        </>
    )
}