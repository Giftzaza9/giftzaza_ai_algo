import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../../../components/shared/Layout';
import { Button, Fab, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Add, KeyboardArrowUp, Search } from '@mui/icons-material';
import { FilterSelector } from '../../../components/product/FilterSelector';
import { productPerPageAdmin, sortOptions } from '../../../constants/constants';
import { debounce } from 'lodash';
import { ProductCard } from '../../../components/product/ProductCard';
import { getProducts } from '../../../services/product';
import { Product } from '../../../constants/types';
import { ProductSkeletonCard } from '../../../components/skeletons/ProductSkeletonCard';
import { Waypoint } from 'react-waypoint';
import { AddNewProductModal } from '../../../components/product/AddNewProductModal';
import { ScrollToTop } from '../../../components/shared/ScrollToTop';

export const AdminProducts = () => {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('latest');
  const [searchDebounced, setSearchDebounced] = useState<string>('');
  const [searchRaw, setSearchRaw] = useState<string>('');
  const [queryString, setQueryString] = useState<string>(`page=1&limit=${productPerPageAdmin}&sort=latest`);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [addNewModalOpen, setAddNewModalOpen] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearchDebounced(val);
    }, 400),
    []
  );

  const fetchProducts = useCallback(async (qString?: string) => {
    try {
      setProductsLoading(true);
      const { data } = await getProducts(qString);
      if (data?.docs?.length > 0) {
        setProducts((prev) => [...prev, ...data.docs]);
      }
      setHasNextPage(data?.hasNextPage);
      setTotalProducts(data?.totalDocs);
      setProductsLoading(false);
    } catch (error) {
      setProductsLoading(false);
    }
  }, []);

  const refetchProducts = useCallback(async () => {
    await fetchProducts(`page=1&limit=${productPerPageAdmin}&sort=latest`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeProduct = (id: string) => {
    setProducts((prev) => prev?.filter((p) => p.id !== id));
  };

  useEffect(() => {
    console.log('Inside 1');
    const queryParams: string[] = [`limit=${productPerPageAdmin}`, `page=${1}`];
    if (filters.length > 0) queryParams.push(`filter=${filters.join(',')}`);
    queryParams.push(`sort=${sort}`);
    if (searchDebounced.trim()) queryParams.push(`search=${searchDebounced}`);
    setProducts([]);
    setPage(1);
    setQueryString(queryParams.join('&'));
  }, [filters, sort, searchDebounced, page]);

  useEffect(() => {
    console.log('Inside 2');
    const pageUpdated = queryString
      ?.split('&')
      ?.map((param) => {
        if (param?.startsWith('page')) return `page=${page}`;
        else return param;
      })
      ?.join('&');
    setQueryString(pageUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    console.log({ queryString });
    fetchProducts(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  return (
    <Layout>
      {/* TOP-SECTION */}
      <Grid container justifyContent={'space-between'} my={2} px={2}>
        <Grid item id="back-to-top-anchor">
          <Typography pr={2} display={'inline-flex'} variant="h4" fontFamily={'Manrope'}>
            Products
          </Typography>
          <Typography display={'inline-flex'} variant="h6" fontFamily={'Inter'} sx={{ color: 'rgba(125, 141, 160, 1)' }}>
            {`( ${totalProducts} items )`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setAddNewModalOpen(true);
            }}
          >
            <Typography variant="button" fontWeight={600} lineHeight={'17px'} fontFamily={'Inter'}>
              Add New
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid container gap={2} alignItems={'flex-start'}>
        {/* SIDE FILTERS */}
        <Grid item container flex={{ xs: 2, md: 1 }}>
          <FilterSelector filters={filters} setFilters={setFilters} />
        </Grid>

        {/* PRODUCTS */}
        <Grid item container flex={4.5} spacing={'21px'} paddingX={'12px'} paddingBottom={'32px'}>
          {/* SEARCH + SORT */}
          <Grid item container xs={12} gap={'21px'}>
            <Grid item flex={3.4}>
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

          {products?.map((product) => (
            <Grid item xs={12} md={6} lg={3} key={product?.id}>
              <ProductCard removeProduct={removeProduct} product={product} isAdminView />
            </Grid>
          ))}
          {!productsLoading && hasNextPage && (
            <Waypoint
              onEnter={() => {
                setPage((prev) => ++prev);
                setProductsLoading(true);
              }}
            />
          )}
          {productsLoading && (
            <>
              {Array.from({ length: 4 }).map((el, key) => (
                <Grid key={key} item xs={12} md={6} lg={3}>
                  <ProductSkeletonCard isAdminView />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Grid>

      <AddNewProductModal
        refetchProducts={refetchProducts}
        open={addNewModalOpen}
        onClose={() => {
          setAddNewModalOpen(false);
        }}
      />

      <ScrollToTop>
        <Fab size="small" aria-label="scroll back to top" color="primary">
          <KeyboardArrowUp />
        </Fab>
      </ScrollToTop>
    </Layout>
  );
};
