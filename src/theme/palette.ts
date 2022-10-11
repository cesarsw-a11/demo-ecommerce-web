import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface GradientsPaletteOptions {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ChartPaletteOptions {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
const PRIMARY = {
  lighter: '#FBDDCD',
  light: '#F0B7B7',
  main: '#BE1111',
  dark: '#A20909',
  darker: '#5B0321'
};
const SECONDARY = {
  lighter: '#D7EAFF',
  light: '#CCF3FF',
  main: '#387CFF',
  dark: '#1C46B7',
  darker: '#0A217A'
};
const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A'
};
const SUCCESS = {
  lighter: '#CFFCDA',
  light: '#DDFFF3',
  main: '#17D590',
  dark: '#0B9981',
  darker: '#046366'
};
const WARNING = {
  lighter: '#FEF5E3',
  light: '#FFEADA',
  main: '#FCAE73',
  dark: '#B56139',
  darker: '#782A16'
};
const ERROR = {
  lighter: '#FEEADF',
  light: '#FBAFA0',
  main: '#F26060',
  dark: '#AE3046',
  darker: '#741234'
};

const GREY = {
  0: '#FFFFFF',
  100: '#F6F7FB',
  200: '#F4F7FA',
  300: '#D7DCE4',
  400: '#D9DCE2',
  500: '#C4C8CF',
  600: '#8F9AB2',
  700: '#8B98B1',
  800: '#3E4D78',
  900: '#60708F',
  500_8: alpha('#C4C8CF', 0.08),
  500_12: alpha('#C4C8CF', 0.12),
  500_16: alpha('#C4C8CF', 0.16),
  500_24: alpha('#C4C8CF', 0.24),
  500_32: alpha('#C4C8CF', 0.32),
  500_48: alpha('#C4C8CF', 0.48),
  500_56: alpha('#C4C8CF', 0.56),
  500_80: alpha('#C4C8CF', 0.8)
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

const palette = {
  ...COMMON,
  mode: 'light',
  text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
  background: { paper: '#fff', default: '#fff', neutral: GREY[200] },
  action: { active: GREY[600], ...COMMON.action }
} as const;

export default palette;
