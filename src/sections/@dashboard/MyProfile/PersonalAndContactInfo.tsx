import { forwardRef } from 'react';
// @mui
import { Box, Divider, Typography, Stack } from '@mui/material';
// components
import { IconButtonAnimate } from '../../../components/animate';
// utils
import getIcon from '../../../utils/getIcon';
// redux
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

interface PersonalInfo {
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}

interface ContactInfo {
  email: string;
  phoneNumber: string;
}

export default forwardRef(
  (
    {
      setStep,
      personalInfo,
      contactInfo
    }: {
      personalInfo: PersonalInfo;
      contactInfo: ContactInfo;
      setStep: (_v: string) => void;
    },
    ref: any
  ) => {
    
    const { user } = useSelector((state) => state.nuDetectState);

    const username = user?.username || '';
    const phoneNumber = user?.phoneNumber || '';
    const password = user?.password || '';

    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
            Personal info
          </Typography>

          <IconButtonAnimate
            onClick={() => setStep('PersonalInfo')}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
              {getIcon('ic_edit')}
            </Box>
          </IconButtonAnimate>
        </Stack>

        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box mb={8}>
          <Typography variant="body1" color={(theme) => theme.palette.grey[900]} mb={1}>
            Name
          </Typography>

          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]} mb={2}>
            {username}
          </Typography>

          <Typography variant="body1" color={(theme) => theme.palette.grey[900]} mb={1}>
            Address
          </Typography>

          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
            {personalInfo.address1 && `${personalInfo.address1}, `}
            {personalInfo.address2 && `${personalInfo.address2}, `}
            {personalInfo.city && `${personalInfo.city}, `}
            {personalInfo.zipCode && personalInfo.zipCode}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
            Contact info
          </Typography>

          <IconButtonAnimate
            onClick={() => setStep('ContactInfo')}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <Box width={22} height={22} color={(theme) => theme.palette.grey[900]}>
              {getIcon('ic_edit')}
            </Box>
          </IconButtonAnimate>
        </Stack>

        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box>
          <Typography variant="body1" color={(theme) => theme.palette.grey[900]} mb={1}>
            Email
          </Typography>

          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]} mb={2}>
            {contactInfo.email}
          </Typography>

          <Typography variant="body1" color={(theme) => theme.palette.grey[900]} mb={1}>
            Phone number
          </Typography>

          <Typography variant="subtitle1" color={(theme) => theme.palette.grey[900]}>
            {`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
              3,
              6
            )} ${phoneNumber.slice(6, 10)}`}
          </Typography>
        </Box>
      </>
    );
  }
);
