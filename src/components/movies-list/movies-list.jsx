import React from 'react';
import { Col, Row } from 'antd';

import MoviesItem from '../movies-item/movies-item';
import './movies-list.css';

const MoviesList = ({ films, onRatingChange }) => {
  return (
    <section className="movies">
      <Row className="movies__list">
        {films.map((film) => {
          return (
            <Col className="movies__item" span={12} key={film.id}>
              <MoviesItem
                film={film}
                onRatingChange={(rating) => {
                  onRatingChange(film.id, rating);
                }}
              />
            </Col>
          );
        })}
      </Row>
    </section>
  );
};

export default MoviesList;
