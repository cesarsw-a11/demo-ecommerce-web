import { v4 } from 'uuid';
import { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
// hook
// import useResponsive from './hooks/useResponsive';
// theme
import ThemeProvider from './theme';
// routes
import Router from './routes';
//
import Console from './sections/Console';
import FloatingButtonConsole from './components/FloatingButtonConsole';

export default function App() {
  useEffect(() => {
    // The NDS library requires an Unique ID for the session
    const session = v4();
    sessionStorage.setItem('session', session);

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const location = JSON.stringify(position);

    //     console.log(location);
    //   },
    //   (error) => console.log(error),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
  }, []);

  return (
    <ThemeProvider>
      <Stack direction="row" display={{ xs: 'inherit', md: 'flex' }}>
        <Box flex={{ md: 1 }} height={{ md: '100vh' }} sx={{ overflowY: { md: 'scroll' } }}>
          <Router />
        </Box>

        <Console />
      </Stack>

      {/* This tag is necessary by NDS library, the NDS library insert a input (name="nds-pmd") with a payload */}
      <form />

      <FloatingButtonConsole />
    </ThemeProvider>
  );
}
