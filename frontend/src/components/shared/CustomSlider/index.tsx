import { Box, Slider, Typography } from '@mui/material';
import _ from 'lodash';
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

function valuetext(value: number) {
  return `$ ${value}`;
}

interface Props {
  minDistance: number;
  maxValue: number;
  valueTuples: [number, number];
  setValueTuples: Dispatch<SetStateAction<[number, number]>>;
}

export const CustomSlider: FC<Props> = ({ minDistance, maxValue, valueTuples, setValueTuples }) => {

  const [val, setVal] = useState<[number, number]>(valueTuples)
  
  useEffect(() => {
    _.debounce(()=> {setValueTuples(val)}, 700)()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[val])
  
  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], maxValue - minDistance);
        setVal([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setVal([clamped - minDistance, clamped]);
      }
    } else {
      setVal(newValue as [number, number]);
    }
  };

  const marks = [
    {
      value: 0,
      label: '',
    },
    {
      value: maxValue,
      label: '',
    },
  ];

  return (
    <>
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={val}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        max={maxValue}
        min={0}
        marks={marks}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="body1"
          onClick={() => setValueTuples([0, valueTuples[1]])}
          sx={{
            fontSize: '11px',
            fontFamily: 'Inter',
            fontWeight: 500,
            lineHeight: '18.5px',
            color: 'rgba(125, 132, 143, 1)',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          $ {-1}
        </Typography>
        <Typography
          variant="body2"
          onClick={() => setValueTuples([valueTuples[0], maxValue])}
          sx={{
            fontSize: '11px',
            fontFamily: 'Inter',
            fontWeight: 500,
            lineHeight: '18.5px',
            color: 'rgba(125, 132, 143, 1)',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          $ {maxValue}+
        </Typography>
      </Box>
    </>
  );
};
