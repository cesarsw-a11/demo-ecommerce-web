import ClipboardJS from 'clipboard';
import MarkdownJson from 'react-json-view';
import { filter, map, flatten } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
import { animateScroll as scroll } from 'react-scroll';
import { useState, ReactNode, SyntheticEvent, useEffect } from 'react';
//
import { useTheme } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from '@mui/material';
import box from '../../src/assets/icons/box.svg';
import scoreIcon_350 from '../../src/assets/icons/scoreIcon_350.svg';
import scoreIcon_250 from '../../src/assets/icons/scoreIcon_250.svg';
import scoreIcon_0 from '../../src/assets/icons/scoreIcon_0.svg';
import lockIcon from '../../src/assets/icons/lockIcon.svg';
import checkIcon from '../../src/assets/icons/checkIcon.svg';
import captchaIcon from '../../src/assets/icons/captchaIcon.svg';
import '../customStyles/console.css';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Stack,
  Card,
  CardHeader,
  Avatar,
  Divider
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineContent, TimelineDot } from '@mui/lab';
// hook
import useResponsive from '../hooks/useResponsive';
import useCollapseDrawer from '../hooks/useCollapseDrawer';
// redux
import Iconify from '../components/Iconify';
import { openConsole } from '../redux/slices/NuDetect';
import { useSelector, useDispatch } from '../redux/store';

export default function Console() {
  const dispatch = useDispatch();
  const isUpLg = useResponsive('up', 'lg');
  const { isOpenConsole } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    if (isOpenConsole) onToggleCollapse();
    // eslint-disable-next-line
  }, [isUpLg]);

  const { onToggleCollapse } = useCollapseDrawer();

  const handleClose = () => {
    onToggleCollapse();
    dispatch(openConsole(false));
  };

  if (!isOpenConsole) return <></>;

  const content = (
    <>
      <DialogTitle sx={{ py: 2.5 }}>
        <Typography
          variant="subtitle1"
          component={Box}
          fontSize={22}
          color={(theme) => theme.palette.common.white}
        >
          Console
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 24,
            top: 16,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <Iconify icon="ep:close-bold" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ lineBreak: 'anywhere' }}>
        <ConsoleTabs />
      </DialogContent>
    </>
  );

  if (isUpLg)
    return (
      <Box bgcolor="#1f293e" width={{ sm: '30%' }}>
        {content}
      </Box>
    );

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isOpenConsole}
      onClose={handleClose}
      PaperProps={{ sx: { bgcolor: '#1f293e' } }}
    >
      {content}
    </Dialog>
  );
}

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      pt={1}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    sx: {
      borderRadius: 2,
      '&.Mui-selected': { backgroundColor: '#60708f' },
      fontWeight: 'fontWeightRegular'
    }
  };
}

function ConsoleTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => setValue(newValue);

  const handleChangeIndex = (index: number) => setValue(index);

  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: 'rgba(118, 118, 128, 0.24)', borderRadius: 3, p: 0.5 }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab label="Http Logs" {...a11yProps(0)} />
          <Tab label="Timeline" {...a11yProps(1)} />
          <Tab label="Info" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <HttpLogs />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <TimelineConsole />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Info />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}

interface ConsoleContainerProps {
  children?: ReactNode;
  id: string;
  isCardInfo?: Boolean;
}

function ConsoleContainer(props: ConsoleContainerProps) {
  const { children, id, isCardInfo, ...other } = props;
  const consoleHeight = isCardInfo ? "0" : "calc(100vh - 224px)";
  return (
    <Box height={consoleHeight} overflow="auto" bgcolor="#1f293e" id={id} {...other}>
      {children}
    </Box>
  );
}

function HttpLogs() {
  const { history } = useSelector((state) => state.nuDetectState);

  const getJson = () => {
    const json = map(
      filter(history, ({ type }) => !['screen', 'security'].includes(type)),
      ({ type, endpoint, datetime, placement, request, success, error }) => {
        const HttpRequest =
          (type === 'request' && request) ||
          (type === 'success' && success) ||
          (type === 'error' && error) ||
          {};

        return {
          [(type === 'request' && 'RequestInfo') || 'ResponseInfo']: {
            endpoint,
            datetime,
            placement
          },
          [(type === 'request' && 'HttpRequest') || 'HttpResponse']: HttpRequest
        };
      }
    );

    return json;
  };

  useEffect(() => {
    scroll.scrollToBottom({ containerId: `Container-HttpLogs`, duration: 0 });
  }, [history]);

  return (
    <ConsoleContainer id="Container-HttpLogs">
      <MarkdownJson
        src={getJson()}
        name={false}
        theme={{
          base00: "#1f293f",
          base01: "#ffffff",
          base02: "#2f384a",
          base03: "#ffffff",
          base04: "#ffffff",
          base05: "#ffffff",
          base06: "#ffffff",
          base07: "#ffffff",
          base08: "red",
          base09: "#c5b206",
          base0A: "#387cff",
          base0B: "red",
          base0C: "red",
          base0D: "#387cff",
          base0E: "#9359db",
          base0F: "#9359db"
        }}
        indentWidth={2}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
        collapsed={3}
        collapseStringsAfterLength={400}
        {...{ displayArrayKey: false }}
      />
    </ConsoleContainer>
  );
}

function TimelineConsole() {
  const { history } = useSelector((state) => state.nuDetectState);

  const getTimeline = () => {
    const json = map(
      history,
      ({ type, placement, datetime, success, error, displayed }, key, _history) => {
        let screen = placement;
        if (!['screen', 'security'].includes(type)) {
          let screenKey = key - 1;
          while (screenKey > 0 && _history[screenKey].type !== 'screen') screenKey--;

          screen = screenKey >= 0 ? _history[screenKey].endpoint : placement;
        }

        const log =
          (type === 'request' && `Request to ${screen} API`) ||
          (type === 'success' && `Response from ${screen} API`) ||
          (type === 'error' && `Error from ${screen} API`) ||
          (type === 'screen' && `${screen} Screen Displayed`) ||
          '';

        const bgcolor =
          (type === 'request' && `#8127F2`) ||
          (type === 'success' && `#9359DB`) ||
          (type === 'error' && `#B73737`) ||
          (type === 'screen' && `#2791F2`) ||
          '';

        const information = (type === 'success' && success) || null;
        const NuDetectResponse = (type === 'success' && success.NuDetectResponse) || null;
        const typeRequest = type ? type : null;

        const _log = { log, datetime, bgcolor, information, NuDetectResponse, typeRequest };

        let security = null;

        if (['success', 'error'].includes(type)) {
          let interdictionTypes = [];

          let screenKey = key;
          while (screenKey > 0 && _history[screenKey].type !== 'screen') {
            if (_history[screenKey].type === 'success')
              interdictionTypes.push(_history[screenKey].success.interdictionType);
            if (_history[screenKey].type === 'error') interdictionTypes.push('Error');
            screenKey--;
          }

          interdictionTypes = [...interdictionTypes, 'None'].reverse();

          interdictionTypes.reduce((prevInterdiction, currInterdiction) => {
            if (
              (['None', 'Error'].includes(prevInterdiction) &&
                ['NuCaptcha', 'OTP'].includes(currInterdiction)) ||
              (['NuCaptcha'].includes(prevInterdiction) && ['OTP'].includes(currInterdiction))
            ) {
              security = {
                log: `${currInterdiction} Displayed`,
                datetime: datetime,
                bgcolor: '#2791F2'
              };
            } else if (
              (['NuCaptcha'].includes(prevInterdiction) &&
                ['NuCaptcha'].includes(currInterdiction)) ||
              (['OTP'].includes(prevInterdiction) && ['OTP'].includes(currInterdiction))
            ) {
              security = {
                log: `${currInterdiction} Failed Attempt`,
                datetime: datetime,
                bgcolor: '#B73737'
              };
            } else if (
              ['NuCaptcha', 'OTP'].includes(prevInterdiction) &&
              ['None'].includes(currInterdiction)
            ) {
              security = {
                log: `${prevInterdiction} Solved Correctly`,
                datetime: datetime,
                bgcolor: '#21972D'
              };
            } else {
              security = null;
            }

            return currInterdiction;
          });
        }

        if (security) return [_log, security];

        return _log;
      }
    );

    return json;
  };

  const [hideConsole, setHideConsole] = useState(false)
  const [cardInfo, setCardInfo] = useState(0);
  const appBar = document.querySelector('.MuiAppBar-root') as HTMLInputElement | null;

  const handleClick = (key: any) => {
    if (appBar != null) {
      appBar.style.display = 'none';
    }
    setCardInfo(key)
    setHideConsole(true)
  };
  const backToTimeline = (event: any) => {
    if (appBar != null) {
      appBar.style.display = 'block';
    }
    setHideConsole(false)
  };

  const hideAllConsole = hideConsole ? 'none' : '';

  useEffect(() => {
    scroll.scrollToBottom({ containerId: `Container-TimelineConsole`, duration: 0 });
  }, [history]);

  return (
    <ConsoleContainer id="Container-TimelineConsole">
      {map(flatten(getTimeline()), ({ log, datetime, bgcolor, information, NuDetectResponse, typeRequest }, key) => (
        !hideAllConsole ?
          <Card sx={{ display: hideAllConsole, mt: 1 }} key={key}>
            <CardHeader
              sx={
                {
                  bgcolor: '#161d2b'
                }
              }
              avatar={
                <Avatar sx={{ bgcolor: "#2c3649", mb: (information ? 11 : 0) }} variant="rounded" >
                  {(information || typeRequest === "request") && (
                    <Icon>
                      <img alt='boxIcon' src={box} />
                    </Icon>
                  ) || <PersonIcon sx={{ color: "#00c2ff" }} />
                  }
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={() => { handleClick(key) }}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              }
              subheader={
                <>
                  <Typography sx={{
                    fontWeight: 200
                  }} variant="subtitle2" color="#ffffff">
                    {log && (log.replace('Nu', ''))}
                  </Typography>

                  {information && (
                    <Box className='divSuccesIcons'>
                      <img className='cardImage' src={
                        `${information.scoreBand === 'Green' && scoreIcon_0 ||
                        information.scoreBand === 'Yellow' && scoreIcon_250 ||
                        information.scoreBand === 'Red' && scoreIcon_350}`
                      } alt="scoreIcon" />
                      <img className='cardImage' src={
                        `${information.scoreBand === 'Green' && checkIcon ||
                        information.scoreBand === 'Yellow' && lockIcon ||
                        information.scoreBand === 'Red' && captchaIcon}`
                      } alt="interdiction" />
                    </Box>
                  )}
                </>}

              title={
                <Typography sx={{
                  fontWeight: 200
                }} variant="subtitle2" color="#6d727a">
                  {datetime && (datetime.replace(',', ''))}
                </Typography>
              }
            />
          </Card> :
          cardInfo === key ?
            <Card sx={{ mt: 1, bgcolor: '#1f293e', color: 'white' }} key={key}>
              <Typography align='left' variant="h6">
                <IconButton onClick={backToTimeline}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                {(information || typeRequest === "request") && (
                <IconButton>
                  <Avatar sx={{ bgcolor: "#2c3649", mr: 1, ml: 1 }} variant="rounded" >
                    <Icon>
                      <img alt='boxIcon' src={box} />
                    </Icon>
                  </Avatar>
                </IconButton>
                )}

                {log && (log.replace('Nu', ''))}
              </Typography>
              {information && (
                <Box className='divSuccesIcons'>
                  <img className='cardImageInfo' src={
                    `${information.scoreBand === 'Green' && scoreIcon_0 ||
                    information.scoreBand === 'Yellow' && scoreIcon_250 ||
                    information.scoreBand === 'Red' && scoreIcon_350}`
                  } alt="scoreIcon" />
                  <img className='cardImageInfo' src={
                    `${information.scoreBand === 'Green' && checkIcon ||
                    information.scoreBand === 'Yellow' && lockIcon ||
                    information.scoreBand === 'Red' && captchaIcon}`
                  } alt="interdiction" />
                </Box>
              )}
              <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                <Typography variant="subtitle2" sx={{
                  color: '#6d727a',
                  fontWeight: 200
                }}>Event</Typography>
                <Typography
                  variant="subtitle2"
                  className="info__action--copyboard"
                  data-clipboard-text={`${log || ''}`}
                  sx={{
                    fontWeight: 200
                  }}
                >
                  {log && (log.replace('Nu', '')) || ''}
                </Typography>
              </Stack>
              <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                <Typography variant="subtitle2" sx={{
                  color: '#6d727a',
                  fontWeight: 200
                }}>Time</Typography>
                <Typography
                  variant="subtitle2"
                  className="info__action--copyboard"
                  data-clipboard-text={`${datetime || ''}`}
                  sx={{
                    fontWeight: 200
                  }}
                >
                  {datetime.replace(',','') || ''}
                </Typography>
              </Stack>
              <Info isCardInfo={true} />
              <Divider></Divider>
              {NuDetectResponse && (
                <Card sx={{ mt: 1, bgcolor: '#1f293e', color: 'white' }}>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}>Nu Detect Response
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Web Session Id
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mWebSessionId || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Request Id
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mRequestId || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Status Message
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mDistribution || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Status Code
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mStatusCode || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Connect Time MS
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mConnectTimeMS || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Read Time MS
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mReadTimeMS || ''}
                    </Typography>
                  </Stack>
                  <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
                    <Typography variant="subtitle2" sx={{
                      color: '#6d727a',
                      fontWeight: 200
                    }}>Request JSON
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="info__action--copyboard"
                      data-clipboard-text={`${datetime || ''}`}
                      sx={{
                        fontWeight: 200
                      }}
                    >
                      {NuDetectResponse.mRequestJSON || ''}
                    </Typography>
                  </Stack>
                </Card>
              )}
            </Card>
            : ''
      ))}
    </ConsoleContainer>
  );
}

function Info({ isCardInfo = false }) {
  const { webSessionId } = useSelector((state) => state.nuDetectState);

  useEffect(() => {
    const clipboard = new ClipboardJS('.info__action--copyboard');

    clipboard.on('success', (e) => { });

    clipboard.on('error', (e) => { });

    scroll.scrollToBottom({ containerId: `Container-Info`, duration: 0 });
  }, [webSessionId]);

  return (
    <ConsoleContainer id="Container-Info" isCardInfo={isCardInfo}>
      <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
        <Typography variant="subtitle2"
          sx={{
            color: '#6d727a',
            fontWeight: 200
          }}>Session ID</Typography>
        <Typography
          variant="subtitle2"
          className="info__action--copyboard"
          data-clipboard-text={`${sessionStorage.getItem('session') || ''}`}
          sx={{
            fontWeight: 200
          }}
        >
          {sessionStorage.getItem('session') || ''}
        </Typography>
      </Stack>

      {webSessionId && (
        <Stack px={2} py={1} spacing={0.5} color={(theme) => theme.palette.common.white}>
          <Typography variant="subtitle2"
            sx={{
              color: '#6d727a',
              fontWeight: 200
            }}>ND Session ID</Typography>
          <Typography
            variant="subtitle2"
            className="info__action--copyboard"
            data-clipboard-text={`${webSessionId || ''}`}
            sx={{
              fontWeight: 200
            }}
          >
            {webSessionId || ''}
          </Typography>
        </Stack>
      )}
    </ConsoleContainer>
  );
}