import { useEffect, forwardRef } from 'react';
// @mui
import { Box, Link, Typography } from '@mui/material';
//
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

export default forwardRef(({ onNext }: { onNext: () => void }, ref: any) => {
  useEffect(() => {
    setTimeout(() => onNext(), 5000);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box width={36} height={36} color="#212B36" mx="auto" mb={3}>
        {getIcon('ic_mail')}
      </Box>

      <Typography
        variant="subtitle2"
        textAlign="center"
        fontFamily="Roboto"
        color={(theme) => theme.palette.grey[900]}
        maxWidth={221}
        mx="auto"
        mb={20}
      >
        WE SENT YOU INSTRUCTIONS TO RESET YOUR PASSWORD TO YOUR JE****GMAIL.COM EMAIL. PLEASE
        CONTINUE FROM THERE
      </Typography>

      <Typography
        display="block"
        variant="caption"
        textAlign="center"
        fontWeight={300}
        color={(theme) => theme.palette.grey[700]}
        maxWidth={221}
        mx="auto"
      >
        Didn’t received the email?{' '}
        <Link
          variant="overline"
          fontFamily="Roboto"
          fontWeight={800}
          sx={{ textTransform: 'unset', textDecoration: 'unset' }}
        >
          Resend
        </Link>
      </Typography>
    </>
  );
});
