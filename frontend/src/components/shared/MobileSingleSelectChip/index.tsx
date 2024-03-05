import { Grid, Chip } from '@mui/material';
import { FC } from 'react';
import { useStyles } from '../MobileMultiSelectChip/styles';

interface Props {
  title: string;
  items: string[];
  selectedTag: string;
  handleSelect: any;
}

export const MobileSingleSelectChip: FC<Props> = ({ title, items, selectedTag, handleSelect }) => {
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
                variant="outlined"
                onClick={(e) => {
                  handleChipClick(item);
                }}
                label={item}
                className={isSelected ? classes.selectedChipStyle : classes.chipStyle}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
