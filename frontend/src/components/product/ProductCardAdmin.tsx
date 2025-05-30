import {
  Box,
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
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { getCurrencySymbol } from '../../utils/helperFunctions';
import { deleteProduct } from '../../services/product';
import { getSwalConfirmation } from '../../utils/swalConfirm';
import { filterObject } from '../../constants/constants';
import { DeleteIcon } from '../shared/Icons/DeleteIcon';
import _ from 'lodash';
import { Amazon } from '../shared/Icons/Amazon';
import { Bloomingdales } from '../shared/Icons/Bloomingdales';
import { RemoveRedEyeOutlined, Verified } from '@mui/icons-material';

interface Props {
  product: Product;
  isAdminView?: boolean;
  removeProduct: (id: string) => void;
  setPreviewProduct: Dispatch<SetStateAction<Product | undefined>>;
  setPreviewModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const ProductCard: FC<Props> = ({ product, isAdminView, removeProduct, setPreviewProduct, setPreviewModalOpen }) => {
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
      await deleteProduct(product?._id as string);
      removeProduct(product?._id as string);
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
        height: isAdminView ? '512px' : '518px',
        border: '1px solid rgba(233, 218, 241, 1)',
        borderRadius: '16px',
        padding: 2,
      }}
    >
      {isAdminView && isFocused && product?.is_active && (
        <CardHeader
          sx={{ position: 'absolute', top: '12px', right: '12px' }}
          action={
            <Grid container direction={'column'} alignItems={'center'}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewModalOpen(true);
                  setPreviewProduct(product);
                }}
              >
                <RemoveRedEyeOutlined color="primary" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
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
                  bgcolor={'rgba(168, 108, 198, 0.7)'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography variant="body2" fontSize={'12px'} sx={{ color: '#fff' }} textAlign={'center'}>
                    {product?.likes || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant="body2" fontSize={'8px'} sx={{ color: 'rgba(125, 141, 160, 1)' }} textAlign={'center'}>
                  Likes
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
        <Tooltip title={_.capitalize(product?.source)} followCursor color="primary">
          <Box
            component={'a'}
            href={product?.link}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'absolute',
              top: '4px',
              right: '8px',
            }}
          >
            {product?.source === 'amazon' ? <Amazon /> : <Bloomingdales />}
          </Box>
        </Tooltip>
        <img
          src={product?.image ?? ''}
          alt={product?.title}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </Box>
      <CardContent>
        <Stack gap={'16px'}>
          {/* TOP-CHIPS */}

          <Stack gap={'8px'}>
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
                      overflow: 'hidden',
                      maxWidth: '100%',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {product?.title}
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
                  overflow: 'hidden',
                  maxWidth: '100%',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
              >
                {product?.title}
              </Typography>
            )}

            {product?.curated && product?.curator && (
              <Grid container justifyContent="flex-start" alignItems="center" gap="6px">
                <Typography
                  fontWeight={500}
                  sx={{
                    color: 'rgba(168, 108, 198, 1)',
                    display: 'inline-flex',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  Curated by:
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{
                    color: 'rgba(43, 50, 59, 1)',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px',
                    fontFamily: 'Manrope',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {product?.curator?.name}
                </Typography>
              </Grid>
            )}
          </Stack>

          {/* PRICE + RATING */}
          <Grid container direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, lineHeight: '18.15px', textWrap: 'nowrap' }}
            >
              {getCurrencySymbol(product?.price_currency)} {product?.price?.toFixed(2)}
            </Typography>
            {product?.hil && (
              <Tooltip title={'HIL Verified'}>
                <Verified sx={{ fontSize: '15px', color: 'rgba(168, 108, 198, 1)' }} />
              </Tooltip>
            )}
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
          </Grid>

          <Grid container gap={1} height={'56px'}>
            {showTags.map((tag) => (
              <Grid item key={tag}>
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
