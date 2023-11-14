import React from 'react';
import { Menu, Flex } from 'antd';
import './page-header.css';

const items = [
  {
    label: 'Search',
    key: 'search',
  },
  {
    label: 'Rated',
    key: 'rated',
  },
];

const PageHeader = ({ onMenuChange }) => {
  return (
    <header className="page-header">
      <Flex justify="center">
        <Menu mode="horizontal" defaultSelectedKeys={['search']} items={items} onClick={onMenuChange} />
      </Flex>
    </header>
  );
};

export default PageHeader;
