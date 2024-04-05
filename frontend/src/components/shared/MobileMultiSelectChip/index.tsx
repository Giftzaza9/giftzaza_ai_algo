import { Grid, Chip, Typography } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';
import { useStyles } from './styles';

interface Props {
  items: string[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  small?: boolean;
  greyText?: boolean;
  sort?: boolean;
  centerAligned?: boolean;
}

export const MobileMultiSelectChip: FC<Props> = ({ items, setSelectedTags, selectedTags, small, greyText, sort, centerAligned }) => {
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
      <Grid container gap={'4px'} mb={2} justifyContent={centerAligned ? 'center' : 'start'}>
        {(sort ? items?.sort((a, b) => a?.length - b?.length) : items)?.map((item, number) => {
          const isSelected = selectedTags?.includes(item);
          return (
            <Grid item key={item}>
              <Chip
                variant="outlined"
                sx={small ? { height: '40px!important', padding: '8px 4px!important' } : {}}
                onClick={(e: any) => {
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
                        color: isSelected ? 'white' : greyText ? 'rgba(96, 113, 132, 1)' : 'black',
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
