import { Divider, Grid, Switch, TextField, Tooltip, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { ChipMultiSelect } from '../shared/ChipMultiSelect';
import { Product } from '../../constants/types';
import { filterObject } from '../../constants/constants';
import { getCurrencySymbol } from '../../utils/helperFunctions';

interface Props {
  product: Product;
  handleChange: (tags: string[], curated: boolean, scrape?: boolean) => void;
}

export const EditProduct: FC<Props> = ({ product, handleChange }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(product?.tags);
  const [isCurated, setIsCurated] = useState<boolean>(product?.curated);
  const [scrape, setScrape] = useState<boolean>(false);

  useEffect(() => {
    handleChange(selectedTags, isCurated, scrape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, isCurated, scrape]);

  return (
    <>
      <Grid item height={'200px'} position={'relative'}>
        <img src={product?.image} alt={product?.title} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      </Grid>

      <Grid item container gap={1}>
        {
          <Tooltip title={product?.title}>
            <Grid item flex={4}>
              <TextField label="Name" fullWidth size="small" value={product?.title} disabled />
            </Grid>
          </Tooltip>
        }
        <Grid item flex={1}>
          <TextField
            fullWidth
            label="Price"
            size="small"
            value={`${getCurrencySymbol(product?.price_currency)} ${product?.price?.toFixed(2) || '--'}`}
            disabled
          />
        </Grid>
      </Grid>
      <Grid item display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Grid item container gap={2} alignItems={'center'}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(96, 113, 132, 1)',
              fontFamily: 'Manrope',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '18px',
            }}
          >
            Curated
          </Typography>
          <Switch
            checked={isCurated}
            onChange={(e, checked) => {
              setIsCurated(checked);
            }}
          />
        </Grid>
        <Grid item container gap={2} alignItems={'center'} justifyContent={'end'}>
          <Switch
            checked={scrape}
            onChange={(e, checked) => {
              setScrape(checked);
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(96, 113, 132, 1)',
              fontFamily: 'Manrope',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '18px',
            }}
          >
            Re-Scrape
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <ChipMultiSelect
          items={filterObject.age_category}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Age Category"
        />
        <ChipMultiSelect
          items={filterObject.gender}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Gender"
        />
        <ChipMultiSelect
          items={filterObject.interest}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Interest"
        />
        <ChipMultiSelect
          items={filterObject.occasion}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Occasion"
        />
        <ChipMultiSelect
          items={filterObject.relationship}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Relationship"
        />
        <ChipMultiSelect
          items={filterObject.style}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          title="Style"
        />
        <Grid item>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};
