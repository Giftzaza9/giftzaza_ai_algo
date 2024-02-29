import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Fade,
  Grid,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Product } from '../../constants/types';
import { FC, useState } from 'react';
import { ellipsisText } from '../../utils/helperFunctions';
import { Delete, Edit } from '@mui/icons-material';

interface Props {
  product: Product;
  isAdminView?: boolean;
}

export const ProductCard: FC<Props> = ({ product, isAdminView }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Card
      onMouseEnter={() => {
        setIsFocused(true);
      }}
      onMouseLeave={() => {
        setIsFocused(false);
      }}
      sx={{
        position: 'relative',
        height: isAdminView ? '480px' : '518px',
        border: '1px solid rgba(233, 218, 241, 1)',
        borderRadius: '16px',
        padding: 2,
      }}
    >
      {isAdminView && isFocused && (
        <CardHeader
          sx={{ position: 'absolute', top: '12px', right: '12px' }}
          action={
            <>
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>
              <IconButton aria-label="delete">
                <Delete />
              </IconButton>
            </>
          }
        />
      )}
      <Box height={isAdminView ? '270px' : '212px'} overflow={'hidden'}>
        <img
          src={product?.image ?? ''}
          alt={product?.title}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </Box>
      <CardContent>
        <Stack gap={'16px'}>
          {/* TOP-CHIPS */}
          {!isAdminView && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Chip label={`88% match`} size="small" />
              <Chip label={`giftzaza recommended`} size="small" />
            </Stack>
          )}

          {/* Title */}
          {product?.title !== undefined && product?.title?.length > 50 ? (
            <Tooltip
              title={product?.title}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              followCursor
              children={
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(43, 50, 59, 1)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontFamily: 'Manrope',
                  }}
                >
                  {ellipsisText(product?.title, 50)}
                </Typography>
              }
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(43, 50, 59, 1)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                fontFamily: 'Manrope',
              }}
            >
              {product?.title}
            </Typography>
          )}

          {/* PRICE + RATING */}
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="h6" sx={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, lineHeight: '18.15px' }}>
              $ {product?.price?.toFixed(2)}
            </Typography>
            <Tooltip title={product?.rating} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} followCursor>
              <Box>
                <Rating
                  value={product?.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ color: 'rgba(125, 141, 160, 1)' }}
                />
              </Box>
            </Tooltip>
          </Stack>

          {!isAdminView && (
            <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Manrope',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '21px',
                  color: 'rgba(253, 251, 254, 1)',
                }}
              >
                Buy Now
              </Typography>
            </Button>
          )}

          <Grid container gap={1} height={'56px'}>
            {product?.tags?.slice(0, 5).map((tag) => (
              <Grid item>
                <Chip
                  size="small"
                  label={
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '9px', color: 'rgba(211, 95, 106, 1)', fontWeight: 600, lineHeight: '13px' }}
                    >
                      {tag}
                    </Typography>
                  }
                  variant="outlined"
                  color="error"
                  sx={{ backgroundColor: 'rgba(251, 234, 236, 1)' }}
                />
              </Grid>
            ))}
            {product?.tags?.length > 5 && (
              <Grid item>
                <Tooltip
                  title={product?.tags?.slice(5)?.map((tag) => (
                    <div key={tag}>{tag}</div>
                  ))}
                  arrow
                >
                  <Chip
                    size="small"
                    label={
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 600, lineHeight: '13px' }}>
                        {`+${product?.tags?.length - 5} more`}
                      </Typography>
                    }
                    variant="outlined"
                    sx={{ backgroundColor: 'rgba(251, 234, 236, 1)' }}
                  />
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
