import React from 'react';
import { Input } from 'antd';

import './search-input.css';

const onSearch = (value, _e, info) => console.log(info?.source, value);
const SearchInput = () => {
  return (
    <section className="search-input">
      <Input.Search placeholder="Type to search..." onSearch={onSearch} suffix={false} />
    </section>
  );
};

export default SearchInput;
