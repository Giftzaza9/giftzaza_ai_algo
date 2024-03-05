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

export const ChipMultiSelect: FC<Props> = ({ items, setSelectedTags, selectedTags, title }) => {
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
                            color: 'rgba(165, 118, 188, 1)',
                          }
                        : {}
                    }
                  >
                    {item}
                  </StyledTypography>
                }
                sx={{
                  padding: '20px 12px',
                  borderRadius: '32px',
                  border: isSelected ? `2px solid rgba(165, 118, 188, 1)` : ' `1px solid rgba(96, 113, 132, 1)`',
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
