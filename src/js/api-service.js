const API_KEY = '21949656-46ae0ee52c133e17398826e95';

const BASE_SRC = `https://pixabay.com/api/?key=${API_KEY}`;
const NUMBER_OF_PICTURE = 12;

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  
  fetchArticles() {
    const options = {
    Authorization: API_KEY,
  };
  
  
  return fetch(`${BASE_SRC}&q=${this.searchQuery}&image_type=photo&per_page=${NUMBER_OF_PICTURE}&page=${this.page}`, options)
  .then(r => r.json())
  .then(data => {
      this.page += 1;
      return data.hits;
   })
  .catch(error => console.log(error));
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQery) {
    this.searchQuery = newQery;
  }
}