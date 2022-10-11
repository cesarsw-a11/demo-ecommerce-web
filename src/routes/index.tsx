import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="my-account" replace />, index: true },
        {
          path: 'my-account',
          children: [
            { element: <MyAccount />, index: true },
            { path: 'transfer', element: <Transfer /> },
            { path: 'bill-pay', element: <BillPay /> },
            { path: 'payee', element: <Payee /> }
          ]
        },
        {
          path: 'products',
          children: [
            { element: <Products />, index: true },
            { path: 'apply-credit', element: <AppApplyCredit /> }
          ]
        },
        {
          path: 'settings',
          children: [
            // { element: <Settings />, index: true },
            { path: 'my-profile', element: <MyProfile /> },
            { path: 'change-password', element: <ChangePassword /> }
          ]
        }
      ]
    },
    { path: 'apply-credit', element: <AuthApplyCredit /> },
    {
      path: 'password-reset',
      element: <PasswordReset />
    },
    {
      path: 'signin',
      element: <SignIn />
    },
    {
      path: '/',
      element: <EcommerceHomeScreen />
    },

    { path: '*', element: <Navigate to="/" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const SignIn = Loadable(lazy(() => import('../pages/auth/SignIn')));
const SignUp = Loadable(lazy(() => import('../pages/auth/SignUp')));
const PasswordReset = Loadable(lazy(() => import('../pages/auth/PasswordReset')));
const AuthApplyCredit = Loadable(lazy(() => import('../pages/auth/ApplyCredit')));
// App
const MyAccount = Loadable(lazy(() => import('../pages/dashboard/MyAccount')));
const Transfer = Loadable(lazy(() => import('../pages/dashboard/Transfer')));
const BillPay = Loadable(lazy(() => import('../pages/dashboard/BillPay')));
const Products = Loadable(lazy(() => import('../pages/dashboard/Products')));
const AppApplyCredit = Loadable(lazy(() => import('../pages/dashboard/ApplyCredit')));
const Payee = Loadable(lazy(() => import('../pages/dashboard/Payee')));
const MyProfile = Loadable(lazy(() => import('../pages/dashboard/MyProfile')));
const ChangePassword = Loadable(lazy(() => import('../pages/dashboard/ChangePassword')));
// E-commerce
const EcommerceHomeScreen = Loadable(lazy(() => import('../pages/ecommerce/HomeScreen')));
