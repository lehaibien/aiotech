'use client';

import { Box, Container, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type NoItemProps = {
  title?: string;
  description: string;
  icon: SvgIconComponent;
};

export const NoItem = ({
  title = 'Không có dữ liệu',
  description,
  icon: Icon,
}: NoItemProps) => {
  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography
          variant='h4'
          component='h1'
          gutterBottom>
          {title}
        </Typography>
        <Typography
          variant='subtitle1'
          color='text.secondary'
          sx={{ mb: 4 }}>
          {description}
        </Typography>
      </Box>
    </Container>
  );
};
