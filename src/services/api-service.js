export default class ApiService {
  _baseUrl = 'https://api.themoviedb.org';
  _apiKey = '26afbbaab30b838257035f206323de5e';

  getResource = async (url) => {
    const result = await fetch(url);

    return await result.json();
  };

  getMovies = (text, page) => {
    const searchQuery = text.trim();
    let url = searchQuery ? '/3/search/movie' : '/3/movie/popular';
    let fetchUrl = new URL(url, this._baseUrl);
    if (searchQuery) {
      fetchUrl.searchParams.append('query', searchQuery);
    }
    fetchUrl.searchParams.append('api_key', this._apiKey);
    fetchUrl.searchParams.append('language', 'en-US');
    fetchUrl.searchParams.append('page', page);
    const res = this.getResource(fetchUrl);
    return res;
  };
}
