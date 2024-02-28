import { createTheme } from "@mui/material";

export const theme = createTheme({
    typography: {
      fontFamily: ['Manrope', 'Inter', 'Roboto'].join(','),
    },
    palette: {
      primary: {main: 'rgba(168, 108, 198, 1)'},
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            color: '#FFF',
            textAlign: 'center',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '21px',
            backgroundColor: 'rgba(168, 108, 198, 1)',
            border: 'none',
            display: 'flex',
            padding: '12px 20px',
            borderRadius: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: 'auto',
            '&:hover': {
              border: 'none',
              background: 'rgba(168, 108, 198, 1)',
              color: '#FFF',
            },
            '&:active': {
              border: 'none',
              color: '#FFF',
              background: 'rgba(168, 108, 198, 1)',
            },
            '&:hover:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: -1,
              margin: '-3px',
              borderRadius: 'inherit',
              background: 'rgb(168, 108, 198 , 0.1)',
            },
          },
          containedPrimary: {
            color: '#FFF',
            textAlign: 'center',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '21px',
            backgroundColor: 'rgba(168, 108, 198, 1)',
            border: 'none',
            display: 'flex',
            padding: '12px 24px',
            borderRadius: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0px',
            width: 'auto',
            '&:hover': {
              border: 'none',
              background: 'rgba(168, 108, 198, 1)',
              color: '#FFF',
            },
            '&:active': {
              border: 'none',
              color: '#FFF',
              background: 'rgba(168, 108, 198, 1)',
            },
            '&:hover:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: -1,
              margin: '-3px',
              borderRadius: 'inherit',
              background: 'rgb(80, 43, 99 , 0.3)',
            },

          },
          containedSecondary: {
            borderRadius: '8px',
            color: '#101828',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.40) 33.65%, rgba(255, 255, 255, 0.40) 65.42%, rgba(255, 255, 255, 0.40) 100%)',
            backdropFilter: 'blur(25px)',
            fontWeight: 400,
            fontSize: '12px',
            '&:hover': {
              border: 'none',
              background: 'rgba(255, 255, 255, 0.60)',
              color: '#101828',
            },
            '&:active': {
              border: 'none',
              color: '#101828',
              background: 'rgba(255, 255, 255, 0.60)',
            },
            '&:hover:before': {
              display: 'none',
            },
          },
          outlinedSecondary: {
            color: 'rgba(165, 118, 188, 1)',
            textAlign: 'center',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '21px',
            background: 'transparent',
            border: '1px solid rgba(165, 118, 188, 1)',
            display: 'flex',
            padding: '12px 20px',
            borderRadius: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: 'auto',
            '&:hover': {
              border: '1px solid rgb(80, 43, 99 , 0.3)',
              backgroundColor:
                'transparent',
              color: 'rgba(165, 118, 188, 1)',
            },
            '&:active': {
              border: '1px solid rgb(80, 43, 99 , 0.3)',
              color: 'rgba(165, 118, 188, 1)',
              backgroundColor:
                'transparent',
            },
          },
          textPrimary: {
            color: 'rgba(165, 118, 188, 1)',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            lineHeight: '17px',
            fontSize: '14px',
            fontWeight: 500,
            background: 'transparent',
            height: 'auto',
            padding: '0px 16px',
            marginBlock: '8px',
            textTransform: 'none',
            '&:hover': {
              background: 'transparent',
              color: 'rgba(165, 118, 188, 1)',
            },
            '&:before': {
              display: 'none',
            },
          },
        },
      }
    //   MuiTab: {
    //     styleOverrides: {
    //       root: {
    //         "&.Mui-selected": {
    //           color: "#525FE1",
    //           fontWeight: "700",
    //         },
    //         "&.MuiStepIcon-active": { backgoundColor: "red" },
    //         "&.MuiStepIcon-completed": { backgoundColor: "green" },
    //         "&.Mui-disabled .MuiStepIcon-root": { backgoundColor: "cyan" },
    //       },
    //     },
    //   },
    },
  });