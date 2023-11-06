import React from 'react';
import { Spin, Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import debounce from 'lodash.debounce';

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
    searchText: '',
  };

  _onSearch = (evt) => {
    this.setState({ searchText: evt.target.value, page: 1 });
    this.downloadsMovies(evt.target.value);
  };

  downloadsMovies = (query = '', page = 1) => {
    this.setState({ loading: true });
    api
      .getMovies(query, page)
      .then((response) => {
        this.setState({
          movies: response.results,
          totalFilms: response.total_results,
          page: response.page,
          loading: false,
        });
      })
      .catch(this.onError);
  };

  componentDidMount() {
    this.downloadsMovies();
  }

  debouncedOnSearch = debounce((evt) => this._onSearch(evt), 800);

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onChangePage = (page) => {
    this.setState({ page: page });
    this.downloadsMovies(this.state.searchText, page);
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

    const messageNoMovies =
      this.state.movies.length === 0 && !(this.state.error || this.state.loading) ? (
        <Alert
          message="Not found"
          description="There are no results for your query. Please try to change it or try again later"
          type="warning"
        ></Alert>
      ) : null;

    return (
      <div className="container">
        <Online>
          <PageHeader />
          <main>
            <SearchInput onChange={this.debouncedOnSearch} />
            {errorMessage}
            {spinner}
            {content}
            {messageNoMovies}
          </main>
          <PageFooter totalFilms={this.state.totalFilms} page={this.state.page} onChangePage={this.onChangePage} />
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
