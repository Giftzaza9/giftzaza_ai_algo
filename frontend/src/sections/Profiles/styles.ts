export const startedChipsStyle = {
  padding: '28px 15px',
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
  border: 0
};

export const genderChipsStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  padding: '25px 10px',
  borderRadius: '32px',
  backgroundColor: 'white',
  color: 'rgba(0, 0, 0, 1)',
  fontSize: '18px',
  fontWeight: '600',
  fontFamily: 'Inter',
  cursor: 'pointer',
  width: '-webkit-fill-available',
};

export const animationStyle = {
  animation: 'fadeIn 0.3s ease-in',
  maxHeight: 'calc(var(--vh) * 66)',
  overflow: 'auto',
  mt: '64px'
};

export const forwardButtonStyle ={
  cursor: 'pointer',
  bgcolor: 'rgba(221, 110, 63, 1)',
  color: 'white',
  fontSize: '18px',
  fontFamily: 'Inter',
  fontWeight: '600',
  padding: '6px 15px!important',
}