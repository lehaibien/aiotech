import { Home } from '@mui/icons-material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

type BreadcrumbProps = {
  items: {
    label: string;
    href: string;
  }[];
};

export default function NavBreadcrumbs({ items }: BreadcrumbProps) {
  let actualPath = '';
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator={<NavigateNextRoundedIcon fontSize='small' />}
      sx={{
        [`& .${breadcrumbsClasses.separator}`]: {
          color: 'gray',
          margin: 1,
        },
        [`& .${breadcrumbsClasses.ol}`]: {
          alignItems: 'center',
        },
      }}
    >
      {items.map((item, index) => {
        actualPath += `/${item.href.toLowerCase()}`; // Accumulate the path
        if (item.href === 'dashboard') {
          return (
            <Link key={index} href='/dashboard' aria-label='Quay trở về trang tổng quan'>
              <Home sx={{ display: 'flex', alignItems: 'center' }} />
            </Link>
          );
        }
        return index === items.length - 1 ? (
          <Typography key={index} color='text.primary'>
            {item.label}
          </Typography>
        ) : (
          <Link key={index} href={actualPath} className='font-semibold'>
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
