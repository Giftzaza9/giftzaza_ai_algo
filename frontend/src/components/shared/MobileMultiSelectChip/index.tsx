import { Grid, Chip } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';
import { useStyles } from './styles';

interface Props {
  items: string[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

export const MobileMultiSelectChip: FC<Props> = ({ items, setSelectedTags, selectedTags }) => {
  const classes = useStyles();

  const handleChipClick = (item: string) => {
    const isSelected = selectedTags?.includes(item);
    if (isSelected) {
      setSelectedTags((prev) => prev?.filter((el) => el !== item));
    } else {
      setSelectedTags((prev) => [...prev, item]);
    }
  };

  return (
    <>
      <Grid container gap={1} mb={2}>
        {items?.map((item, number) => {
          const isSelected = selectedTags?.includes(item);
          return (
            <Grid item key={item}>
              <Chip
                variant="outlined"
                onClick={(e: any) => {
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
