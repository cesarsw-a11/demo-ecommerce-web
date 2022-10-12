import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
// components
import LoadingScreen from '../components/LoadingScreen';
import NavBar from 'sections/Ecommerce/NavBar';
import Container from '@mui/material/Container';
import Footer from 'sections/Ecommerce/Footer';

// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NavBar />
      <Container sx={{ minWidth: '100%' }}>
        <Component {...props} />
      </Container>
      <Footer />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: '/',
      element: <EcommerceHomeScreen />
    },
    {
      path: '/product_detail',
      element: <ProductDetail />
    },

    { path: '*', element: <Navigate to="/" replace /> }
  ]);
}


// App
const EcommerceHomeScreen = Loadable(lazy(() => import('../pages/ecommerce/HomeScreen')));
const ProductDetail = Loadable(lazy(() => import('../pages/ecommerce/ProductDetail')));
