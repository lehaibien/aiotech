"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { UUID } from "crypto";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface BlogPostItemProps {
  id: UUID;
  title: string;
  imageUrl: string;
  createdDate: Date;
}

function BlogPostItem({ id, title, imageUrl, createdDate }: BlogPostItemProps) {
  const theme = useTheme();
  const date = new Date(createdDate);
  
  // Format date parts
  const formattedDate = date.toLocaleDateString('vi-VN');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return (
    <Card
      sx={{
        height: {
          xs: 320,
          md: 400,
        },
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        boxShadow: theme.shadows[2],
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8]
        },
        bgcolor: alpha(theme.palette.background.paper, 0.8)
      }}
    >
      <CardActionArea 
        LinkComponent={Link} 
        href={`/blogs/${id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ position: 'relative' }}>
          <Chip
            label="Bài viết"
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontWeight: 500,
              fontSize: '0.7rem',
              boxShadow: theme.shadows[2]
            }}
          />
          <CardMedia
            component="div"
            sx={{ 
              position: "relative", 
              height: { xs: 200, md: 280 },
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '30%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                zIndex: 1
              }
            }}
          >
            <Image
              src={imageUrl}
              alt={title}
              height={500}
              width={1200}
              priority
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                aspectRatio: 16 / 9,
                transition: 'transform 0.5s ease'
              }}
            />
          </CardMedia>
        </Box>
        
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            p: 2.5,
            pt: 2
          }}
        >
          <Typography
            component="h3"
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: theme.palette.text.primary,
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main
              }
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mt: 'auto'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}>
              <CalendarTodayIcon 
                fontSize="small" 
                sx={{ 
                  fontSize: '0.9rem', 
                  color: theme.palette.text.secondary 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ color: 'text.secondary' }}
              >
                {formattedDate}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}>
              <AccessTimeIcon 
                fontSize="small" 
                sx={{ 
                  fontSize: '0.9rem', 
                  color: theme.palette.text.secondary 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ color: 'text.secondary' }}
              >
                {hours}:{minutes}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default memo(BlogPostItem, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.createdDate === nextProps.createdDate
  );
});
