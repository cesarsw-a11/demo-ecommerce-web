import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import { Box, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit
    }: { onNext: () => void; setDisabledHandleSubmit: (value: boolean) => void },
    ref: any
  ) => {
    const handleSubmit = () => {
      onNext();
    };

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      setDisabledHandleSubmit(true);
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
          maxWidth={160}
          mx="auto"
        >
          YOUR ACCOUNT HAS BEEN ACTIVATED
        </Typography>
      </Box>
    );
  }
);
