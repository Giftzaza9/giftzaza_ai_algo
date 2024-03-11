import { Grid, Chip, Typography } from '@mui/material';
import { FC } from 'react';
import { useStyles } from '../MobileMultiSelectChip/styles';

interface Props {
  title: string;
  items: string[];
  selectedTag: string;
  handleSelect: any;
  small?: boolean;
}

export const MobileSingleSelectChip: FC<Props> = ({ title, items, selectedTag, handleSelect, small }) => {
  const classes = useStyles();

  const handleChipClick = (val: string) => {
    handleSelect(title, val);
  };

  return (
    <>
      <Grid container gap={1} mb={2}>
        {items?.map((item, number) => {
          const isSelected = selectedTag === item;
          return (
            <Grid item key={number + '~singleSelectChip'}>
              <Chip
                sx={small ? { height: '40px!important', padding: '22px 8px!important' } : {}}
                variant="outlined"
                onClick={(e) => {
                  handleChipClick(item);
                }}
                label={
                  small ? (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        lineHeight: '21px',
                        color: isSelected ? 'white' : 'rgba(96, 113, 132, 1)',
                      }}
                    >
                      {item}
                    </Typography>
                  ) : (
                    item
                  )
                }
                className={isSelected ? classes.selectedChipStyle : classes.chipStyle}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
