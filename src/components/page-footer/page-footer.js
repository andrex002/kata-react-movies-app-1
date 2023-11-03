import React from 'react';
import { Pagination } from 'antd';

import './page-footer.css';

const PageFooter = (props) => {
  return (
    <footer className="page-footer">
      <Pagination
        className="page-footer__pagination"
        current={props.page}
        defaultCurrent={1}
        total={props.totalFilms}
        showSizeChanger={false}
        onChange={() => {}}
      ></Pagination>
    </footer>
  );
};
export default PageFooter;
