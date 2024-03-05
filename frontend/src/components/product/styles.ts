import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: any) => ({
  addProductContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    paddingX: '24px',
    borderRadius: '16px',
    overflow: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    flexDirection: 'column',
    gap: '24px',
    flexWrap: 'nowrap',
  },
  addModalButtonContainer: {
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingY: '12px',
  },
  buttonCircularProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
}));
