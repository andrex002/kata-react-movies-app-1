import React from 'react';
import { Card, Flex, Typography, Tag, Space, Rate, Progress } from 'antd';
import { format } from 'date-fns';

import { GenresConsumer } from '../genres-context/genres-context';
import './movies-item.css';

const truncatesDescription = (text, clip = 200) => {
  text = text.trim();
  if (text.length <= clip) {
    return text;
  }
  let croppedText = text.substring(0, clip);
  croppedText = croppedText.substring(0, croppedText.lastIndexOf(' '));
  return `${croppedText}...`;
};

const MoviesItemView = ({ film, onRatingChange }) => {
  let releaseDate = new Date(film.release_date);
  releaseDate = releaseDate instanceof Date && !isNaN(releaseDate) ? format(releaseDate, 'MMMM d, y') : 'n/a';
  const calculatesСolorRatingBar = () => {
    if (film.vote_average >= 7) {
      return '#66E900';
    } else if (film.vote_average >= 5) {
      return '#E9D100';
    } else if (film.vote_average >= 3) {
      return '#E97E00';
    } else {
      return '#E90000';
    }
  };

  return (
    <GenresConsumer>
      {(genres) => {
        return (
          <React.Fragment>
            <img
              className="card-film__poster"
              src={`https://image.tmdb.org/t/p/original${film.poster_path}`}
              alt={film.title}
            />
            <div className="card-film__info">
              <Typography.Title className="card-film__title">{film.title}</Typography.Title>
              <Typography.Text className="card-film__release-date" type="secondary">
                {releaseDate}
              </Typography.Text>
              <Space className="card-film__genres" size={[0, 8]} wrap>
                {genres.map((genre) => {
                  if (film.genre_ids.includes(genre.id)) {
                    return (
                      <Tag key={genre.id} className="card-film__genre">
                        {genre.name}
                      </Tag>
                    );
                  }
                  return null;
                })}
              </Space>
              <Typography.Paragraph className="card-film__description">
                {truncatesDescription(film.overview)}
              </Typography.Paragraph>
              <Rate className="card-film__rate" count={10} defaultValue={film.rating} onChange={onRatingChange}></Rate>
              <Progress
                className="card-film__vote-average"
                type="circle"
                percent={film.vote_average * 10}
                format={() => Math.round(film.vote_average * 10) / 10}
                size={34}
                strokeColor={calculatesСolorRatingBar()}
              />
            </div>
          </React.Fragment>
        );
      }}
    </GenresConsumer>
  );
};

const MoviesItem = ({ film, onRatingChange }) => {
  return (
    <Card hoverable className="card-film">
      <Flex className="card-film__flex">
        <MoviesItemView film={film} onRatingChange={onRatingChange} />
      </Flex>
    </Card>
  );
};

export default MoviesItem;
