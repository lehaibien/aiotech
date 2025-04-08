'use client'

import { Typography } from '@mui/material';

export default function NoRowOverlay() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography variant='body1' color='textSecondary'>
        Không có dữ liệu
      </Typography>
    </div>
  );
}
