import { useEffect, forwardRef } from 'react';
// @mui
import { Box, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

export default forwardRef(({ onNext }: { onNext: () => void }, ref: any) => {
  useEffect(() => {
    setTimeout(() => onNext(), 3000);
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Box width={24} height={24} mx="auto" mb={2} color={(theme) => theme.palette.success.main}>
        {getIcon('ic_done_light')}
      </Box>

      <Typography
        variant="subtitle2"
        textAlign="center"
        fontFamily="Roboto"
        color={(theme) => theme.palette.grey[900]}
        maxWidth={170}
        mx="auto"
      >
        YOUR PASSWORD WAS SUCCESSFULLY CHANGED
      </Typography>
    </Box>
  );
});
