import Slider from 'react-slick';
import { useRef } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme, styled } from '@mui/material/styles';
import SwitchUnstyled, { switchUnstyledClasses } from '@mui/base/SwitchUnstyled';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// redux
import { useSelector } from '../../../redux/store';
// utils
import getIcon from '../../../utils/getIcon';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative'
}));

const RootSwitch = styled('span')(({ theme }) => ({
  fontSize: 0,
  position: 'relative',
  display: 'inline-block',
  width: 40,
  height: 20,
  cursor: 'pointer',

  [`&.${switchUnstyledClasses.disabled}`]: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },

  [`& .${switchUnstyledClasses.track}`]: {
    background: theme.palette.grey[400],
    borderRadius: 10,
    display: 'block',
    height: '100%',
    width: '100%',
    position: 'absolute'
  },

  [`& .${switchUnstyledClasses.thumb}`]: {
    display: 'block',
    width: 14,
    height: 14,
    top: 3,
    left: 3,
    borderRadius: 16,
    backgroundColor: theme.palette.grey[0],
    position: 'relative',
    transition: 'all 200ms ease'
  },

  [`&.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb}`]: {
    backgroundColor: theme.palette.grey[500],
    boxShadow: `0 0 1px 8px ${alpha(theme.palette.common.black, 0.25)}`
  },

  [`&.${switchUnstyledClasses.checked}`]: {
    [`.${switchUnstyledClasses.thumb}`]: {
      left: 22,
      top: 3,
      backgroundColor: theme.palette.grey[0]
    },

    [`.${switchUnstyledClasses.track}`]: {
      background: theme.palette.success.main
    }
  },

  [`& .${switchUnstyledClasses.input}`]: {
    cursor: 'inherit',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 1,
    margin: 0
  }
}));

// ----------------------------------------------------------------------

export default function Carousel() {
  const theme = useTheme();
  const isUpSm = useResponsive('up', 'sm');
  const carouselRef = useRef<Slider | null>(null);

  const { accounts } = useSelector((state) => state.accountState);

  const settings = {
    centerMode: true,
    centerPadding: '0px',
    infinite: true,
    // slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: { swipe: true, infinite: false }
      },
      ...[...Array((590 - 360) / 10)]
        .map((_, index, { length }) => {
          const position = index + 1;
          const calc = 0.25 / length;
          const point = position * 10;
          const padding = point > 140 ? 1 : 1.15;
          const centerPadding = 5 + position * (padding - position * calc);
          return {
            breakpoint: 360 + point,
            settings: { centerPadding: `${centerPadding}%`, swipe: true, infinite: false }
          };
        })
        .reverse(),
      {
        breakpoint: 360,
        settings: { centerPadding: '0px', swipe: true, infinite: false }
      }
    ]
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <RootStyle>
      <Stack
        {...(isUpSm && {
          bgcolor: theme.palette.grey[0],
          borderRadius: 2,
          sx: { maxWidth: 600, mx: 'auto' }
        })}
      >
        <Slider ref={carouselRef} {...settings}>
          {accounts.map(({ id, type, balance, deposits, debits, number }) => (
            <Box key={id} pb={{ xs: 2 }} p={{ sm: 5 }}>
              {isUpSm && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5" color={(theme) => theme.palette.grey[900]}>
                    Cards
                  </Typography>

                  <SwitchUnstyled component={RootSwitch} defaultChecked />
                </Stack>
              )}

              <Stack direction="row" justifyContent={{ xs: 'center', sm: 'space-between' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack
                    bgcolor={(theme) =>
                      theme.palette[
                        (type === 'saving' && 'primary') ||
                          (type === 'checking' && 'secondary') ||
                          (type === 'credit' && 'error') ||
                          'success'
                      ].main
                    }
                    borderRadius={5}
                    sx={{ width: 300, height: 180, py: { xs: 2, sm: 3 }, px: 3 }}
                    boxShadow={(theme) => `0px 3px 8px ${alpha(theme.palette.common.black, 0.25)}`}
                  >
                    <Stack
                      direction="row"
                      justifyContent={{ xs: 'flex-end', sm: 'center' }}
                      alignItems="center"
                      mb={1.5}
                      {...(isUpSm && {
                        flexGrow: 1,
                        mb: 0
                      })}
                    >
                      <Box width={20} height={20} color={(theme) => theme.palette.grey[0]} mr={0.5}>
                        {getIcon(
                          (type === 'saving' && 'ic_coint_light') ||
                            (type === 'checking' && 'ic_check_light') ||
                            (type === 'credit' && 'ic_card') ||
                            'ic_investment_light'
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        fontWeight={300}
                        textAlign="right"
                        color={(theme) => theme.palette.grey[0]}
                      >
                        {(type === 'saving' && 'Savings Account') ||
                          (type === 'checking' && 'Checking Account') ||
                          (type === 'credit' && 'Credit Card') ||
                          'Investment Account'}
                      </Typography>
                    </Stack>

                    {!isUpSm && (
                      <>
                        <Typography variant="subtitle2" color={(theme) => theme.palette.grey[0]}>
                          Balance
                        </Typography>

                        <Typography variant="h4" color={(theme) => theme.palette.grey[0]} mb={4}>
                          {fCurrency(balance)}
                        </Typography>
                      </>
                    )}

                    <Typography
                      variant="body1"
                      fontSize={21}
                      textAlign="right"
                      color={(theme) => theme.palette.grey[0]}
                    >
                      {number}
                    </Typography>
                  </Stack>

                  {isUpSm && (
                    <Box
                      width={24}
                      height={24}
                      color={(theme) => theme.palette.common.black}
                      ml={2}
                      onClick={handleNext}
                      sx={{ cursor: 'pointer' }}
                    >
                      {getIcon('ic_arrow_right')}
                    </Box>
                  )}
                </Stack>

                {isUpSm && (
                  <Stack justifyContent="space-between">
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle2" color={(theme) => theme.palette.grey[300]}>
                        Balance
                      </Typography>

                      <Typography variant="h4" color={(theme) => theme.palette.grey[900]}>
                        {fCurrency(balance)}
                      </Typography>
                    </Stack>

                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle2" color={(theme) => theme.palette.grey[300]}>
                        Deposits
                      </Typography>

                      <Typography variant="h4" color={(theme) => theme.palette.success.main}>
                        {fCurrency(deposits)}
                      </Typography>
                    </Stack>

                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle2" color={(theme) => theme.palette.grey[300]}>
                        Debits
                      </Typography>

                      <Typography variant="h4" color={(theme) => theme.palette.error.main}>
                        {fCurrency(debits)}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Box>
          ))}
        </Slider>
      </Stack>
    </RootStyle>
  );
}
