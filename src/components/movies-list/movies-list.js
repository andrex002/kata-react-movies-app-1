import React from 'react';
import { Col, Row } from 'antd';

import MoviesItem from '../movies-item/movies-item';
import './movies-list.css';

const MoviesList = ({ films }) => {
  return (
    <section className="movies">
      <Row className="movies__list" gutter={[36, 36]}>
        {films.map((film) => {
          return (
            <Col className="movies__item" span={12} key={film.id}>
              <MoviesItem film={film} />
            </Col>
          );
        })}
      </Row>
    </section>
  );
};

export default MoviesList;
