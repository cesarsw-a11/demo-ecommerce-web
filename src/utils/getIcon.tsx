import SvgIconStyle from '../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={require(`../assets/icons/${name}.svg`)} sx={{ width: 1, height: 1 }} />
);

export default getIcon;
