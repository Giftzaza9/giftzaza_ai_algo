import { makeStyles } from '@mui/styles';

// import { makeStyles } from "@mui/material";

export const useStyles = makeStyles((theme: any) => ({
  startedChipsStyle: {
    padding: '32px 15px',
    borderRadius: '32px',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Inter',
    cursor: 'pointer',
    width: '-webkit-fill-available',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: 'rgba(221, 110, 63, 1)!important',
      color: 'white',
    },
    '&:active': {
      backgroundColor: 'rgba(221, 110, 63, 1)!important',
      color: 'white',
    },
  },

  genderChipsStyle: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: '32px 15px',
    borderRadius: '32px',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Inter',
    cursor: 'pointer',
    width: '-webkit-fill-available',
  },
}));
