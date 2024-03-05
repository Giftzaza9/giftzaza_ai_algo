import { Typography, Grid, Chip, styled, Divider } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';

interface Props {
  title: string;
  items: string[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

const StyledTypography = styled(Typography)({
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '21px',
  color: 'rgba(96, 113, 132, 1)',
});

export const MobileMultiSelectChip: FC<Props> = ({ items, setSelectedTags, selectedTags, title }) => {
  const handleChipClick = (item: string) => {
    const isSelected = selectedTags?.includes(item);
    if (isSelected) setSelectedTags((prev) => prev?.filter((el) => el !== item));
    else setSelectedTags((prev) => [...prev, item]);
  };

  return (
    <>
      <Divider sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(96, 113, 132, 1)',
            fontFamily: 'Manrope',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '18px',
          }}
        >
          {title}
        </Typography>
      </Divider>

      <Grid container gap={1} mb={2}>
        {items?.map((item) => {
          const isSelected = selectedTags?.includes(item);
          return (
            <Grid item>
              <Chip
                variant="outlined"
                onClick={(e) => {
                  handleChipClick(item);
                }}
                label={
                  <StyledTypography
                    variant="body1"
                    sx={
                      isSelected
                        ? {
                            fontWeight: 600,
                            color: 'white',
                            background: 'rgba(107, 60, 102, 1)',
                          }
                        : {
                            color: 'black',
                        }
                    }
                  >
                    {item}
                  </StyledTypography>
                }
                sx={{
                  padding: '20px 12px',
                  borderRadius: '32px',
                  border: isSelected ? `2px solid rgba(107, 60, 102, 1)` : ' `1px solid rgba(216, 221, 227, 1)`',
                  cursor: 'pointer',
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};