import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from '../../../components/shared/Layout';
import { Button, Card, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { FilterSelector } from '../../../components/product/FilterSelector';
import { sortOptions } from '../../../constants/constants';
import { debounce } from 'lodash';

export const AdminProducts = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('latest');
  const [searchDebounced, setSearchDebounced] = useState<string>('');
  const [searchRaw, setSearchRaw] = useState<string>('');
  const [queryString, setQueryString] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearchDebounced(val);
    }, 400),
    []
  );

  useEffect(() => {
    const queryParams: string[] = [];
    if (filters.length > 0) queryParams.push(`filters=${filters.join(',')}`);
    queryParams.push(`sort=${sort}`);
    if (searchDebounced.trim()) queryParams.push(`search=${searchDebounced}`);
    setQueryString(queryParams.join('&'));
  }, [filters, sort, searchDebounced]);

  useEffect(() => {
    console.log({ queryString });
  }, [queryString]);

  return (
    <Layout>
      {/* TOP-SECTION */}
      <Grid container justifyContent={'space-between'} my={2} px={2}>
        <Grid item>
          <Typography variant="h4" fontFamily={'Manrope'}>
            Products
          </Typography>
        </Grid>
        <Grid item>
          <Button size="small" variant="contained" startIcon={<Add />}>
            <Typography variant="button">Add New</Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid container gap={2} alignItems={'flex-start'}>
        {/* SIDE FILTERS */}
        <Grid item container flex={{ xs: 2, md: 1 }}>
          <FilterSelector filters={filters} setFilters={setFilters} />
        </Grid>

        {/* PRODUCTS */}
        <Grid item container flex={3} spacing={'21px'} paddingX={'12px'}>
          {/* SEARCH + SORT */}
          <Grid item container xs={12} gap={'21px'}>
            <Grid item flex={3}>
              <TextField
                sx={{ backgroundColor: 'white' }}
                hiddenLabel
                fullWidth
                size="small"
                value={searchRaw}
                onChange={(e) => {
                  setSearchRaw(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Search products"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item flex={1}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
                fullWidth
                size="small"
                sx={{ backgroundColor: 'white' }}
              >
                {sortOptions?.map((option) => (
                  <MenuItem key={option?.value} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{ minHeight: '480px', border: '1px solid rgba(233, 218, 241, 1)', borderRadius: '16px', padding: '12px' }}
            >
              1
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{ minHeight: '480px', border: '1px solid rgba(233, 218, 241, 1)', borderRadius: '16px', padding: '12px' }}
            >
              2
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{ minHeight: '480px', border: '1px solid rgba(233, 218, 241, 1)', borderRadius: '16px', padding: '12px' }}
            >
              3
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{ minHeight: '480px', border: '1px solid rgba(233, 218, 241, 1)', borderRadius: '16px', padding: '12px' }}
            >
              4
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};
