// @mui
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses
} from '@mui/material/LinearProgress';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
// utils
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[100]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5
    // backgroundColor: '#1a90ff'
  }
}));

function LinearProgressWithLabel(props: LinearProgressProps & { title: string; value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Box sx={{ width: '100%', mr: 2 }}>
        <BorderLinearProgress variant="determinate" {...props} />

        <Typography variant="body2" color={(theme) => theme.palette.grey[900]}>
          {props.title}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body1"
          color={(theme) => theme.palette.grey[900]}
          fontSize={24}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function SpendingReport() {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        px: 5,
        py: 3,
        boxShadow: 'unset',
        borderRadius: 2,
        mt: (theme) => theme.spacing(4)
      }}
    >
      <CardHeader
        title={
          <Typography fontFamily="Roboto" variant="h5" color={(theme) => theme.palette.grey[900]}>
            Spending Report
          </Typography>
        }
      />

      <CardContent>
        {[
          {
            icon: 'ic_car',
            name: 'Groceries',
            value: 39,
            color: theme.palette.warning
          },
          {
            icon: 'ic_vehicle',
            name: 'Electronics',
            value: 12,
            color: theme.palette.success
          },
          {
            icon: 'ic_plane',
            name: 'Travels',
            value: 49,
            color: theme.palette.secondary
          }
        ].map(({ icon, name, value, color }, index, { length }) => (
          <Stack key={index} direction="row" {...(index < length - 1 && { mb: 2 })}>
            <Stack
              width={44}
              minWidth={44}
              minHeight={44}
              bgcolor={color.light}
              borderRadius={1}
              alignItems="center"
              justifyContent="center"
              mr={2}
            >
              <Box width={24} height={24} color={color.main}>
                {getIcon(icon)}
              </Box>
            </Stack>

            <LinearProgressWithLabel
              title={name}
              value={value}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  backgroundColor: color.main
                }
              }}
            />
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}
