export default class ApiService {
  _baseUrl = 'https://api.themoviedb.org/3';
  _apiKey = '26afbbaab30b838257035f206323de5e';

  getResource = async (url) => {
    const result = await fetch(url);

    return await result.json();
  };

  getAllMovies = () => {
    const res = this.getResource(
      'https://api.themoviedb.org/3/movie/popular?api_key=26afbbaab30b838257035f206323de5e&language=en-US&page=1'
    );
    return res;
  };
}
