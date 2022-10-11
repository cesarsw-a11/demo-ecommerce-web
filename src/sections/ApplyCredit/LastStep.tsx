import { useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import { Box, Typography } from '@mui/material';
// utils
import getIcon from '../../utils/getIcon';

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

    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };

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
          maxWidth={192}
          mx="auto"
          mb={2}
        >
          YOUR REQUEST HAS BEEN SENT. YOU’LL GET A DECISION BY EMAIL SHORTLY
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          REFERENCE NUMBER:
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          fontFamily="Roboto"
          color={(theme) => theme.palette.grey[900]}
        >
          {getRandomInt(1000000000, 9999999999)}
        </Typography>
      </Box>
    );
  }
);
