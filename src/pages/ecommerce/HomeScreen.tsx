import Container from '@mui/material/Container';

//Sections
import Navbar from '../../sections/Ecommerce/NavBar';
import MainBanner from '../../sections/Ecommerce/MainBanner';
import ProductSection from '../../sections/Ecommerce/ProductSection';
import Banners from '../../sections/Ecommerce/Banners';
import Footer from '../../sections/Ecommerce/Footer';
import MobileBottomNav from '../../sections/Ecommerce/MobileBottomNav';

export default function HomeScreen() {

    return (
        <>
            <Navbar />
            <Container sx={{ minWidth: '100%' }}>
                <MainBanner />
                <ProductSection />
                <Banners/>
                <MobileBottomNav/>
            </Container>
            <Footer/>
        </>
    )
}