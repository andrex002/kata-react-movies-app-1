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
import { GenresProvider } from '../genres-context/genres-context';

export default class App extends React.Component {
  api = new ApiService();

  state = {
    movies: [],
    listGenres: [],
    totalFilms: null,
    page: 1,
    tab: 'search',
    loading: true,
    error: false,
    searchText: '',
    guestKey: null,
    genres: [],
  };

  _onSearch = (evt) => {
    this.setState({ searchText: evt.target.value, page: 1 });
    this.downloadsMovies(evt.target.value);
  };

  getGuestSessionKey = () => {
    this.setState({ loading: true });
    this.api
      .createGuestSession()
      .then((data) => {
        this.setState({ loading: false, guestKey: data.guest_session_id });
      })
      .catch((err) => {
        this.setState({ loading: false, error: err });
      });
  };

  downloadsMovies = (query = '', page = 1) => {
    this.setState({ loading: true });
    this.api
      .getMovies(query, page, this.state.guestKey)
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

  downloadsRatedMovies = (page = 1) => {
    this.setState({ loading: true });
    this.api
      .getsRatedMovies(page, this.state.guestKey)
      .then((response) => {
        this.setState({
          movies: response.results,
          totalFilms: response.total_results,
          page: response.page,
          loading: false,
          error: false,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  getGenres = () => {
    this.api
      .getGenres()
      .then((data) => this.setState({ genres: data.genres }))
      .catch((err) => this.setState({ error: err }));
  };

  componentDidMount() {
    this.getGuestSessionKey();
    this.getGenres();
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

  onRatingChange = (id, rating) => {
    this.setState(({ movies }) => {
      const index = movies.findIndex((item) => item.id === id);
      const updatedMovie = { ...movies[index], rating: rating };
      return {
        movies: [...movies.slice(0, index), updatedMovie, ...movies.slice(index + 1)],
      };
    });
    this.api.addsRating(id, rating, this.state.guestKey).then((res) => {
      if (!res.success) {
        this.setState({ error: true });
      }
    });
  };

  onMenuChange = (menuItem) => {
    this.setState({ tab: menuItem.key });
    menuItem.key === 'search' ? this.downloadsMovies(this.state.searchText, this.state.page) : null;
    menuItem.key === 'rated' ? this.downloadsRatedMovies() : null;
  };

  render() {
    const spinner = this.state.loading ? <Spin size={'large'} /> : null;
    const content = !(this.state.loading || this.state.error) ? (
      <GenresProvider value={this.state.genres}>
        <MoviesList films={this.state.movies} onRatingChange={this.onRatingChange} />
      </GenresProvider>
    ) : null;
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

    const searchInput =
      this.state.tab === 'search' ? (
        <SearchInput onChange={this.debouncedOnSearch} value={this.state.searchText} />
      ) : null;

    return (
      <div className="container">
        <Online>
          <PageHeader onMenuChange={this.onMenuChange} />
          <main>
            {searchInput}
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
