import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha, Box, Card, CardContent, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  percentageChange,
  icon,
}: StatCardProps) {
  return (
    <Card
      sx={(theme) => ({
        boxShadow: theme.shadows[1],
        width: '100%',
        padding: 1,
      })}
    >
      <CardContent>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='body1' fontWeight='700' color='text.secondary'>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={(theme) => ({
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { color: 'primary.main' },
              })}
            </Box>
          )}
        </Box>
        <Typography fontSize='1.8rem' mb={1}>
          {value}
        </Typography>
        {percentageChange && (
          <Box display='flex' alignItems='center' gap={1}>
            <Typography
              variant='body2'
              color={percentageChange > 0 ? 'success' : 'error'}
              sx={(theme) => ({
                backgroundColor:
                  percentageChange > 0
                    ? alpha(theme.palette.success.main, 0.2)
                    : alpha(theme.palette.error.main, 0.2),
                color: percentageChange > 0 ? 'success.main' : 'error.main',
                borderRadius: 1,
                px: 1,
                display: 'inline-block',
                width: 75
              })}
            >
              {Math.abs(percentageChange)}%{' '}
              {percentageChange > 0 ? (
                <TrendingUpIcon fontSize='small' />
              ) : (
                <TrendingDownIcon fontSize='small' />
              )}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              so với tháng trước
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
