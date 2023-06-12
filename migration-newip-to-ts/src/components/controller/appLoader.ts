import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    super('https://rss-news-api.onrender.com/', {
      apiKey: '8f026eec0c81457c8fe74f19f15e1b5d',
    });
  }
}

export default AppLoader;
