
import Box from '@mui/material/Box';
import banner2 from '../../../src/assets/illustrations/banner2.png';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import banner3 from '../../../src/assets/illustrations/banner3.png';
import banner4 from '../../../src/assets/illustrations/banner4.png';

export default function Banners() {
    return (
        <>
            <Box>
                <Card>
                    <CardMedia image={banner2} sx={{ position: 'relative', paddingTop: '33%' }} />
                </Card>
            </Box>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }} marginTop={3}>
                <Grid item xs={6}>
                    <img src={banner3} width="100%" />
                </Grid>
                <Grid item xs={6}>
                    <img src={banner4}  width="100%" />
                </Grid>
            </Grid>
        </>

    )
}