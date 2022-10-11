import { Fab } from '@mui/material';
// hook
import useCollapseDrawer from '../hooks/useCollapseDrawer';
// redux
import { openConsole } from '../redux/slices/NuDetect';
import { useDispatch, useSelector } from '../redux/store';
//
import Iconify from './Iconify';

export default function FloatingButtonConsole() {
  const dispatch = useDispatch();

  const { isOpenConsole } = useSelector((state) => state.nuDetectState);

  const { onToggleCollapse } = useCollapseDrawer();

  const handleOpen = () => {
    onToggleCollapse();
    dispatch(openConsole(!isOpenConsole));
  };

  if (isOpenConsole) return <></>;

  return (
    <Fab
      color="default"
      onClick={handleOpen}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16
      }}
    >
      <Iconify icon="bx:code-alt" />
    </Fab>
  );
}
