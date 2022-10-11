import Container from '@mui/material/Container';

//Sections
import Navbar from '../../sections/Ecommerce/NavBar';
import MainBanner from '../../sections/Ecommerce/MainBanner';
import ProductSection from '../../sections/Ecommerce/ProductSection';
import Banners from '../../sections/Ecommerce/Banners';

export default function HomeScreen() {

    return (
        <>
            <Navbar />
            <Container sx={{ minWidth: '100%' }}>
                <MainBanner />
                <ProductSection />
                <Banners/>
            </Container>
        </>
    )
}