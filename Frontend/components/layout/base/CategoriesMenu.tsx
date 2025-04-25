'use client';

import { ComboBoxItem } from '@/types';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover
} from '@mui/material';
import Link from 'next/link';
import { useCallback, useState } from 'react';

type CategoryMenuProps = {
  data: ComboBoxItem[];
};

export function CategoryMenu({ data }: CategoryMenuProps) {
  const [categoryAnchorEl, setCategoriesAnchorEl] =
    useState<null | HTMLElement>(null);
  const categoryMenuOpen = Boolean(categoryAnchorEl);
  const handleCategoriesClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setCategoriesAnchorEl(event.currentTarget);
    },
    []
  );
  const handleCategoriesClose = useCallback(() => {
    setCategoriesAnchorEl(null);
  }, []);
  return (
    <>
      <Button
        startIcon={<GridViewOutlinedIcon />}
        endIcon={
          <KeyboardArrowRightIcon
            sx={{
              transform: categoryMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        }
        onClick={handleCategoriesClick}
        sx={{
          width: '12rem',
          display: 'flex',
          padding: '0.5rem 1rem',
          paddingLeft: 0,
          fontSize: '1rem',
          transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '& > .MuiButton-endIcon': {
            marginLeft: 'auto',
          },
          '& > .MuiButton-startIcon': {
            marginRight: 1,
          },
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        }}>
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
        elevation={2}
        sx={{
          top: 10,
          left: 0,
          maxHeight: '32rem',
        }}>
        <List
          sx={{
            padding: 0,
            width: '12rem',
          }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/products'
              onClick={handleCategoriesClose}>
              <ListItemText
                primary='Tất cả sản phẩm'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
          {data.map((category, index) => (
            <ListItem
              key={category.value || index}
              disablePadding>
              <ListItemButton
                component={Link}
                href={`/products?category=${category.text}`}
                onClick={handleCategoriesClose}>
                <ListItemText
                  primary={category.text}
                  sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
