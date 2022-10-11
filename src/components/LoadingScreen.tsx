import { styled } from '@mui/material/styles';
//
import ProgressBar from './ProgressBar';
import Image from './Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LoadingScreen() {
  return (
    <>
      <ProgressBar />
      <RootStyle>
        <Image src={require('../assets/logo.png')} alt="Logo" disabledEffect />
      </RootStyle>
    </>
  );
}
