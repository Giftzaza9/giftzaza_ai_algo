import { Grid, Chip, Typography } from '@mui/material';
import { FC } from 'react';
import { useStyles } from '../MobileMultiSelectChip/styles';
import { CreateProfileBody } from '../../../services/profile';

interface Props {
  title: string;
  items: string[];
  selectedTag: string;
  handleSelect: (title: keyof CreateProfileBody, value: string) => void;
  small?: boolean;
  greyText?: boolean;
  sort?: boolean;
  centerAligned?: boolean;
}

export const MobileSingleSelectChip: FC<Props> = ({
  title,
  items,
  selectedTag,
  handleSelect,
  small,
  greyText,
  sort,
  centerAligned,
}) => {
  const classes = useStyles();

  const handleChipClick = (val: string) => {
    handleSelect(title as keyof CreateProfileBody, val);
  };

  return (
    <>
      <Grid container gap={'4px'} mb={2} justifyContent={centerAligned ? 'center' : 'start'}>
        {(sort ? items?.sort((a, b) => a?.length - b?.length) : items)?.map((item, number) => {
          const isSelected = selectedTag === item;
          return (
            <Grid item key={number + '~singleSelectChip'}>
              <Chip
                sx={small ? { height: '40px!important', padding: '8px 4px!important' } : {}}
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
