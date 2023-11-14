import React from 'react';
import { Input } from 'antd';

import './search-input.css';

const SearchInput = (props) => {
  return (
    <section className="search-input">
      <Input.Search
        placeholder="Type to search..."
        onChange={props.onChange}
        suffix={false}
        defaultValue={props.value}
      />
    </section>
  );
};

export default SearchInput;
