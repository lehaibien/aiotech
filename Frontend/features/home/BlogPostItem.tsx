'use client';

import dayjs from '@/lib/extended-dayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { UUID } from "@/types";
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostItemProps {
  id: UUID;
  title: string;
  imageUrl: string;
  createdDate: Date;
  imgHeight?: number;
}

export default function BlogPostItem({
  id,
  title,
  imageUrl,
  createdDate,
  imgHeight = 200,
}: BlogPostItemProps) {
  const postDate = dayjs(createdDate);
  const formattedDate = postDate.format('DD/MM/YYYY');
  const hours = postDate.format('HH');
  const minutes = postDate.format('mm');
  return (
    <Card>
      <CardActionArea
        LinkComponent={Link}
        href={`/blogs/${id}`}>
        <CardMedia
          component='div'
          sx={{
            height: imgHeight,
            overflow: 'hidden',
          }}>
          <Image
            src={imageUrl}
            alt={title}
            height={630}
            width={1200}
            priority
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              aspectRatio: 1200 / 630,
            }}
          />
        </CardMedia>

        <CardContent sx={{ py: 1, px: 2 }}>
          <Typography
            component='h3'
            variant='h6'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 'auto',
            }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
              <CalendarTodayIcon fontSize='small' />
              <Typography variant='caption'>{formattedDate}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
              <AccessTimeIcon fontSize='small' />
              <Typography variant='caption'>
                {hours}:{minutes}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
