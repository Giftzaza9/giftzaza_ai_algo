import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { filterObject } from '../../constants/constants';
import _ from 'lodash';
import { Dispatch, FC, SetStateAction } from 'react';
import { RestartAlt } from '@mui/icons-material';
import { CustomSlider } from '../shared/CustomSlider';

interface Props {
  filters: string[];
  setFilters: Dispatch<SetStateAction<string[]>>;
  budgetTuples: [number, number];
  setBudgetTuples: Dispatch<SetStateAction<[number, number]>>;
  hil: boolean;
  setHil: Dispatch<SetStateAction<boolean>>;
  showDeletedProducts: boolean;
  setShowDeletedProducts: Dispatch<SetStateAction<boolean>>;
}

export const FilterSelector: FC<Props> = ({
  filters,
  setFilters,
  budgetTuples,
  setBudgetTuples,
  hil,
  showDeletedProducts,
  setHil,
  setShowDeletedProducts,
}) => {
  const handleFilterChecked = (checked: boolean, value: string) => {
    if (checked) setFilters((prev) => [...prev, value]);
    else setFilters((prev) => prev.filter((el) => el !== value));
  };

  return (
    <Grid
      container
      bgcolor={'rgba(253, 251, 254, 1)'}
      borderRadius={'16px'}
      border={'1px solid rgba(233, 218, 241, 1)'}
      flexDirection={'column'}
      paddingBottom={3}
    >
      <Grid item padding={'10px 14px'}>
        <Grid container justifyContent={'space-between'} alignItems={'center'}>
          <Grid item>
            <Typography variant="h6" fontSize={'20px'} fontWeight={500} lineHeight={'24px'} color={'rgba(43, 50, 59, 1)'}>
              Filters
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Reset the filters">
              <IconButton
                onClick={() => {
                  setFilters([]);
                  setBudgetTuples([0, 1000]);
                }}
              >
                <RestartAlt />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>

      <Divider variant="fullWidth" sx={{ backgroundColor: 'rgba(233, 218, 241, 1)' }} />
      <Grid item>
        {Object.entries(_.omit(filterObject, 'budget')).map(([key, val]) => (
          <>
            <Accordion key={key} sx={{ boxShadow: 'none' }}>
              <AccordionSummary
                sx={{ '&.Mui-expanded': { minHeight: '56px' } }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id={`panel-${key}`}
              >
                <Typography variant="subtitle1" fontFamily={'Inter'} fontWeight={600} fontSize={'14px'} lineHeight={'16px'}>
                  {key
                    ?.split('_')
                    ?.map((el) => _.capitalize(el))
                    ?.join(' ')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position">
                    {val?.map((tag) => (
                      <FormControlLabel
                        value={tag}
                        control={<Checkbox checked={filters?.includes(tag)} />}
                        label={tag}
                        labelPlacement="end"
                        onChange={(e, checked) => {
                          handleFilterChecked(checked, tag);
                        }}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
            <Divider variant="fullWidth" sx={{ backgroundColor: 'rgba(233, 218, 241, 1)' }} />
          </>
        ))}

        <Accordion key={'budget'} sx={{ boxShadow: 'none' }}>
          <AccordionSummary
            sx={{ '&.Mui-expanded': { minHeight: '56px' } }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={`panel-budget`}
          >
            <Typography variant="subtitle1" fontFamily={'Inter'} fontWeight={600} fontSize={'14px'} lineHeight={'16px'}>
              {`Budget`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CustomSlider maxValue={1000} minDistance={50} valueTuples={budgetTuples} setValueTuples={setBudgetTuples} />
          </AccordionDetails>
        </Accordion>
        <Divider variant="fullWidth" sx={{ backgroundColor: 'rgba(233, 218, 241, 1)' }} />

        <Accordion key={'other'} sx={{ boxShadow: 'none' }}>
          <AccordionSummary
            sx={{ '&.Mui-expanded': { minHeight: '56px' } }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={`panel-other`}
          >
            <Typography variant="subtitle1" fontFamily={'Inter'} fontWeight={600} fontSize={'14px'} lineHeight={'16px'}>
              {`Other filters`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset">
              <FormGroup aria-label="position">
                <FormControlLabel
                  value={hil}
                  control={<Checkbox checked={hil} />}
                  label={`HIL Flag`}
                  labelPlacement="end"
                  onChange={(e, checked) => {
                    setHil(checked);
                  }}
                />
                <FormControlLabel
                  value={showDeletedProducts}
                  control={<Checkbox checked={showDeletedProducts} />}
                  label={`Deleted Products`}
                  labelPlacement="end"
                  onChange={(e, checked) => {
                    setShowDeletedProducts(checked);
                  }}
                />
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Divider variant="fullWidth" sx={{ backgroundColor: 'rgba(233, 218, 241, 1)' }} />
      </Grid>
    </Grid>
  );
};
