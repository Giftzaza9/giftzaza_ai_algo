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
import { ellipsisText, getCurrencySymbol } from '../../utils/helperFunctions';
import { deleteProduct } from '../../services/product';
import { getSwalConfirmation } from '../../utils/swalConfirm';
import { filterObject } from '../../constants/constants';
import { EditDocumentIcon } from '../shared/Icons/EditDocumentIcon';
import { DeleteIcon } from '../shared/Icons/DeleteIcon';

interface Props {
  product: Product;
  isAdminView?: boolean;
  removeProduct: (id: string) => void;
}

export const ProductCard: FC<Props> = ({ product, isAdminView, removeProduct }) => {
  const [isFocused, setIsFocused] = useState(false);

  const showTags: string[] = [];
  const remainingTags: string[] = [];
  product?.tags?.forEach((el) => {
    if (filterObject.age_category.includes(el)) return;
    if (!filterObject.age_category.includes(el) && el?.length < 10 && showTags?.length < 5) showTags.push(el);
    else remainingTags.push(el);
  });

  const handleDelete = async () => {
    try {
      const isConfirm = await getSwalConfirmation();
      if (!isConfirm) return;
      await deleteProduct(product?.id);
      removeProduct(product?.id);
    } catch (error) {
      console.error(error);
    }
  };

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
            <Grid container direction={'column'} alignItems={'center'}>
              <IconButton aria-label="edit">
                <EditDocumentIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  handleDelete();
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
              <Grid item>
                <Box
                  borderRadius={'50%'}
                  height={32}
                  width={32}
                  bgcolor={'rgba(168, 108, 198, 0.4)'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography variant="body2" fontSize={'12px'} sx={{ color: '#fff' }} textAlign={'center'}>
                    0
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant="body2" fontSize={'8px'} sx={{ color: 'rgba(125, 141, 160, 1)' }} textAlign={'center'}>
                  Clicks
                </Typography>
              </Grid>
            </Grid>
          }
        />
      )}
      <Box height={isAdminView ? '270px' : '212px'} overflow={'hidden'}>
        {product?.curated && (
          <Typography
            fontWeight={500}
            sx={{
              position: 'absolute',
              top: '10px',
              left: 0,
              bgcolor: 'rgba(168, 108, 198, 1)',
              color: 'white',
              display: 'inline-flex',
              padding: '2px 14px',
              fontSize: '14px',
              borderRadius: '0px 4px 4px 0px',
            }}
          >
            Curated
          </Typography>
        )}
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
              {getCurrencySymbol(product?.price_currency)} {product?.price?.toFixed(2)}
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
            {showTags.map((tag) => (
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
            {remainingTags?.length > 0 && (
              <Grid item>
                <Tooltip
                  title={remainingTags?.map((tag) => (
                    <div key={tag}>{tag}</div>
                  ))}
                  arrow
                >
                  <Chip
                    size="small"
                    label={
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 600, lineHeight: '13px' }}>
                        {`+${remainingTags?.length} more`}
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
