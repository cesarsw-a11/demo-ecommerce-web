import { useNavigate } from 'react-router-dom';
import { useEffect, forwardRef, ChangeEvent, useImperativeHandle } from 'react';
// @mui
import {
  Box,
  Button,
  Stack,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Radio,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
import { BindNewFields } from '../../../utils/NuDetectSDK';

// ----------------------------------------------------------------------

const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[900]
    }
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginRight: 0
  }
}));

// ----------------------------------------------------------------------

export default forwardRef(
  (
    {
      onNext,
      setDisabledHandleSubmit,
      payee,
      setPayee
    }: {
      onNext: () => void;
      setDisabledHandleSubmit: (value: boolean) => void;
      payee: string | null;
      setPayee: (_v: string | null) => void;
    },
    ref: any
  ) => {
    useEffect(() => {
      BindNewFields();
    }, []);

    const navigate = useNavigate();
    const isUpSm = useResponsive('up', 'sm');

    const { payees } = useSelector((state) => state.accountState);

    const handleSubmit = () => {
      if (payee) onNext();
    };

    useImperativeHandle(ref, () => ({
      onHandleSubmit: handleSubmit
    }));

    useEffect(() => {
      if (isUpSm) setDisabledHandleSubmit(true);
      // eslint-disable-next-line
    }, [isUpSm]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setPayee((event.target as HTMLInputElement).value);
      if (!isUpSm) onNext();
    };

    return (
      <>
        <Stack direction="row" justifyContent={{ sm: 'flex-end' }} mb={3}>
          <Button
            variant="text"
            size="small"
            startIcon={
              <Box width={24} height={24} color={(theme) => theme.palette.grey[900]}>
                {getIcon('ic_plus')}
              </Box>
            }
            onClick={() =>
              navigate('/app/my-account/payee', {
                state: { route: '/app/my-account/transfer', section: 'transfer' }
              })
            }
          >
            <Typography fontFamily="Roboto" variant="subtitle1" sx={{ textTransform: 'none' }}>
              Add new payee
            </Typography>
          </Button>
        </Stack>

        {isUpSm && (
          <>
            <Typography
              variant="subtitle2"
              fontFamily="Roboto"
              fontSize={18}
              textAlign="center"
              color={(theme) => theme.palette.grey[900]}
              mb={4}
            >
              Select a Payee
            </Typography>

            <FormControl sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                fontWeight={300}
                color={(theme) => theme.palette.grey[900]}
                mb={1}
              >
                Search a payee
              </Typography>

              <CssTextField
                fullWidth
                placeholder="Name, Account number"
                color="secondary"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box width={24} height={24} color={(theme) => theme.palette.grey[900]}>
                        {getIcon('ic_search')}
                      </Box>
                    </InputAdornment>
                  ),
                  sx: { fontFamily: 'Roboto', fontWeight: 800 }
                }}
              />
            </FormControl>

            <Typography
              variant="body1"
              fontWeight={300}
              fontSize={18}
              color={(theme) => theme.palette.grey[700]}
              mb={2}
            >
              Frequent payees
            </Typography>
          </>
        )}

        <RadioGroup value={payee} onChange={handleChange}>
          {payees.map(({ id, name, account, type }) => (
            <FormControlLabel
              key={id}
              value={id}
              control={<Radio />}
              label={
                <Stack
                  direction="row"
                  color={(theme) => theme.palette.grey[900]}
                  justifyContent="space-between"
                  px={{ xs: 1, sm: 0 }}
                >
                  <Stack>
                    <Typography variant="subtitle2">{name}</Typography>
                    <Typography variant="body2">
                      Account Nº: <b>{account}</b>
                    </Typography>
                  </Stack>

                  <Stack>
                    <Typography variant="body2" textTransform="capitalize">
                      {type.toLowerCase()}
                    </Typography>
                  </Stack>
                </Stack>
              }
              sx={{
                mx: 0,
                mb: 2.5,
                '& .MuiRadio-root': { display: { xs: 'none', sm: 'inline-flex' } },
                '& .MuiFormControlLabel-label': { flexGrow: 1 }
              }}
            />
          ))}
        </RadioGroup>
      </>
    );
  }
);
