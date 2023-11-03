import React from 'react';

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
  };

  componentDidMount() {
    api.getAllMovies().then((response) => {
      this.setState({
        movies: response.results,
        totalFilms: response.total_results,
        page: response.page,
      });
    });
  }

  render() {
    return (
      <div className="container">
        <PageHeader />
        <main>
          <SearchInput />
          <MoviesList films={this.state.movies} />
        </main>
        <PageFooter totalFilms={this.state.totalFilms} page={this.state.page} />
      </div>
    );
  }
}
