export default class ApiService {
  _baseUrl = 'https://api.themoviedb.org';
  _apiKey = '26afbbaab30b838257035f206323de5e';

  _getResource = async (url, page, searchText, payload, body) => {
    let fetchUrl = new URL(url, this._baseUrl);
    fetchUrl.searchParams.append('api_key', this._apiKey);
    if (page) {
      fetchUrl.searchParams.append('page', page);
    }

    fetchUrl.searchParams.append('language', 'en-US');

    if (searchText) {
      searchText = searchText.trim();
      fetchUrl.searchParams.append('query', searchText);
    }

    if (payload) {
      for (let key in payload) {
        fetchUrl.searchParams.append(key, payload[key]);
      }
    }
    let result;
    if (body) {
      result = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ ...body }),
      });
    } else {
      result = await fetch(fetchUrl);
    }

    return await result.json();
  };

  _createsListRatedMovies = (moviesList, ratedList) => {
    let movies = moviesList.results;

    if (ratedList) {
      let ratedMovies = ratedList.results;
      let resultList = movies.map((sMovie) => {
        let isRated = ratedMovies.some((rMovie) => {
          return rMovie.id === sMovie.id;
        });
        if (isRated) {
          let ratedMovie = ratedMovies.find((rMovie) => {
            return rMovie.id === sMovie.id;
          });

          sMovie.rating = ratedMovie.rating;
        }

        return sMovie;
      });
      moviesList.results = resultList;
    }

    return new Promise((resolve) => {
      resolve(moviesList);
    });
  };

  createGuestSession = () => {
    return this._getResource(`${this._baseUrl}/3/authentication/guest_session/new`);
  };

  getMovies = async (text, page, guestKey) => {
    let url;
    if (text) {
      url = '/3/search/movie';
    } else {
      url = '/3/movie/popular';
    }
    const movies = await this._getResource(url, page, text);
    let ratedMovies;
    if (guestKey) {
      ratedMovies = await this.getsRatedMovies(1, guestKey);
    }

    return this._createsListRatedMovies(movies, ratedMovies);
  };

  addsRating = (movieId, rating, guestKey) => {
    const url = `/3/movie/${movieId}/rating`;

    const guestSessionKey = {
      guest_session_id: guestKey,
    };

    const body = { value: rating };

    return this._getResource(url, null, null, guestSessionKey, body);
  };

  getsRatedMovies = (page, guestKey) => {
    const url = `/3/guest_session/${guestKey}/rated/movies`;
    const sortingMovies = { sort_by: 'created_at.desc' };
    return this._getResource(url, page, null, sortingMovies);
  };

  getGenres = () => {
    return this._getResource('/3/genre/movie/list');
  };
}
