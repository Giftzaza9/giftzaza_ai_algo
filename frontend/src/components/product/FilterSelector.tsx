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

interface Props {
  filters: string[];
  setFilters: Dispatch<SetStateAction<string[]>>;
}

export const FilterSelector: FC<Props> = ({ filters, setFilters }) => {
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
      </Grid>
    </Grid>
  );
};
