'use client';

import { formatDate } from '@/lib/utils';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

type BlogCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  createdDate: Date;
};

export default function BlogCard({
  id,
  title,
  imageUrl,
  createdDate,
}: BlogCardProps) {
  return (
    <Card>
      <CardActionArea
        component={Link}
        href={`/blogs/${id}`}
        sx={{}}>
        <CardMedia>
          <Image
            src={imageUrl}
            alt={title}
            width={1200}
            height={630}
            style={{
              aspectRatio: 1200 / 630,
              objectFit: 'cover',
            }}
          />
        </CardMedia>
        <CardContent
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            gutterBottom
            variant='h6'
            component='h2'
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              lineHeight: 1.4,
              height: '2.8em',
            }}>
            {title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 'auto',
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}>
            <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
            <Typography
              variant='body2'
              color='text.secondary'>
              {formatDate(createdDate)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
