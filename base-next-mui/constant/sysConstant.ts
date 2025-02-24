import ComputerIcon from '@mui/icons-material/Computer';
import LaptopIcon from '@mui/icons-material/Laptop';
import React from 'react';

interface CategoryMenuItem {
  name: string;
  icon: JSX.Element;
}

export const categories: CategoryMenuItem[] = [
  {
    name: 'Laptop',
    icon: React.createElement(LaptopIcon),
  },
  {
    name: 'PC',
    icon: React.createElement(ComputerIcon),
  },
  {
    name: 'Mainboard',
    icon: React.createElement(ComputerIcon),
  },
  {
    name: 'CPU',
    icon: React.createElement(ComputerIcon),
  },
  {
    name: 'VGA',
    icon: React.createElement(ComputerIcon),
  },
  {
    name: 'USB',
    icon: React.createElement(ComputerIcon),
  },
  {
    name: 'Ổ cứng HDD',
    icon: React.createElement(ComputerIcon),
  },
];
