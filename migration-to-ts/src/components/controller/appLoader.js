import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    super('https://newsapi.org/v2/', {
      apiKey: '8f026eec0c81457c8fe74f19f15e1b5d',
    });
  }
}

export default AppLoader;
