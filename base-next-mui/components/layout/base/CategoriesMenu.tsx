'use client'

import { ComboBoxItem } from '@/types';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

type CategoryMenuProps = {
  data: ComboBoxItem[];
  position?: 'absolute' | 'unset';
};

export default function CategoryMenu({ position, data }: CategoryMenuProps) {
  const [categoryAnchorEl, setCategoriesAnchorEl] =
    useState<null | HTMLElement>(null);
  const categoryMenuOpen = Boolean(categoryAnchorEl);
  const handleCategoriesClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setCategoriesAnchorEl(event.currentTarget);
  };
  const handleCategoriesClose = () => {
    setCategoriesAnchorEl(null);
  };
  return (
    <>
      <Button
        startIcon={<GridViewOutlinedIcon />}
        endIcon={
          <KeyboardArrowRightIcon
            sx={{
              transform: categoryMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'all 150ms ease-in-out',
            }}
          />
        }
        onClick={handleCategoriesClick}
        sx={{
          textTransform: 'none',
          fontSize: '1.1rem',
          width: '16rem',
          display: 'flex',
          justifyContent: 'flex-start',
          '& > .MuiButton-endIcon': {
            marginLeft: 'auto',
          },
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        Danh mục
      </Button>
      <Popover
        open={categoryMenuOpen}
        anchorEl={categoryAnchorEl}
        onClose={handleCategoriesClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          maxHeight: '32rem',
        }}
      >
        <Box
          position={position}
          sx={(theme) => ({
            left: 0,
            zIndex: 98,
            right: 'auto',
            padding: '0.5rem 0px',
            transformOrigin: 'top',
            boxShadow: theme.shadows[2],
            position: position || 'unset',
            transition: 'all 250ms ease-in-out',
            transform: categoryMenuOpen ? 'scaleY(1)' : 'scaleY(0)',
            backgroundColor: theme.palette.background.paper,
            top: position === 'absolute' ? 'calc(100% + 0.7rem)' : '0.5rem',
          })}
        >
          <List className='w-64'>
            {data.map((category, index) => (
              <ListItem key={index}>
                <ListItemButton
                  LinkComponent={Link}
                  href={`/products?category=${category.text}`}
                  onClick={handleCategoriesClose}
                >
                  {/* <ListItemIcon>{category.icon}</ListItemIcon> */}
                  <ListItemText primary={category.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}
