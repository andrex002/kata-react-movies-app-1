import React from 'react';
import { Spin, Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import PageHeader from '../page-header/page-header';
import SearchInput from '../search-input/search-input';
import MoviesList from '../movies-list/movies-list';
import PageFooter from '../page-footer/page-footer';
import './app.css';
import ApiService from '../../services/api-service';

const api = new ApiService();

export default class App extends React.Component {
  state = {
    movies: [],
    totalFilms: null,
    page: 1,
    loading: true,
    error: false,
  };

  componentDidMount() {
    api
      .getAllMovies()
      .then((response) => {
        this.setState({
          movies: response.results,
          totalFilms: response.total_results,
          page: response.page,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const spinner = this.state.loading ? <Spin size={'large'} /> : null;
    const content = !(this.state.loading || this.state.error) ? <MoviesList films={this.state.movies} /> : null;
    const errorMessage = this.state.error ? (
      <Alert
        message="Server Error"
        description="Something went wrong... Please try again later."
        type="error"
        showIcon
      />
    ) : null;

    return (
      <div className="container">
        <Online>
          <PageHeader />
          <main>
            <SearchInput />
            {errorMessage}
            {spinner}
            {content}
          </main>
          <PageFooter totalFilms={this.state.totalFilms} page={this.state.page} />
        </Online>
        <Offline>
          <Alert
            className="offline-message"
            message="Offline"
            description="Please check your Internet Connection."
            type="error"
            showIcon
          />
        </Offline>
      </div>
    );
  }
}
