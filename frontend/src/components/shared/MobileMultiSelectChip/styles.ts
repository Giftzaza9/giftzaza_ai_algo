import { makeStyles } from '@mui/styles';

// import { makeStyles } from "@mui/material";

export const useStyles = makeStyles((theme: any) => ({
  selectedChipStyle: {
    padding: '26px 8px',
    borderRadius: '32px',
    color: 'white',
    backgroundColor: 'rgba(107, 60, 102, 1)',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Inter',
    cursor: 'pointer',
    width: '-webkit-fill-available',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: 'rgba(107, 60, 102, 1)!important',
      color: 'white!important',
    },
    '&:active': {
      backgroundColor: 'rgba(107, 60, 102, 1)!important',
      color: 'white!important',
    },
  },

  chipStyle: {
    padding: '26px 8px',
    borderRadius: '32px',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Inter',
    cursor: 'pointer',
    border: '1px solid rgba(216, 221, 227, 1)',
    width: '-webkit-fill-available',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: 'white!important',
      color: 'black!important',
    },
    '&:active': {
      backgroundColor: 'white!important',
      color: 'black!important',
    },
  },
}));
