import {
  Card,
  Skeleton,
} from '@mui/material';
import { FC } from 'react';

interface Props {
  isAdminView?: boolean;
}

export const ProductSkeletonCard: FC<Props> = ({ isAdminView }) => {

  return (
    <Card
      sx={{
        height: isAdminView ? '480px' : '518px',
        border: '1px solid rgba(233, 218, 241, 1)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      <Skeleton variant='rectangular' width={'100%'} height={'100%'} />
    </Card>
  );
};
