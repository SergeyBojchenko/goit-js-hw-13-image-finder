import '/sass/main.scss';
import cardImageTemplate from '/templates/card-images-template-markup.hbs';
import debounce from 'lodash.debounce';
import PicturesApiService from '/js/api-service';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';


const refs = {
  searchFormRef: document.querySelector('#search-form'),
  loadMoreBtnRef: document.querySelector('[data-action="btn-load-more"]'),
  listGalleryRef: document.querySelector('.gallery'),
  
};

const picturesApiService = new PicturesApiService();

refs.searchFormRef.addEventListener('input', debounce(onSearch, 500));
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

function onSearch(e) {

  picturesApiService.query = e.target.value;

  if (picturesApiService.query.length < 3) {
    errorSetting.text = 'Please enter your specific query!';
    errorSetting.mode = 'light';
    return error(errorSetting);
  }
  picturesApiService.resetPage();
  picturesApiService.fetchArticles()
    .then(hits => {
      if (!hits.length) {
        errorSetting.text = 'Please enter a more specific query!';
        errorSetting.mode = 'dark';
        error(errorSetting);
      }
      clearGalleryContainer();
      createGalleryMarkup(hits);
      refs.loadMoreBtnRef.removeAttribute('disabled');
    })
    .catch(err => {
      errorSetting.text = `${err}`;
      errorSetting.mode = 'light';
      error(errorSetting);
    }
    );
}

function onLoadMore() {
  picturesApiService.fetchArticles().then(createGalleryMarkup);
}


function createGalleryMarkup(hits) {
  refs.listGalleryRef.insertAdjacentHTML('beforeend', cardImageTemplate(hits));
  
  refs.listGalleryRef.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearGalleryContainer() {
  refs.listGalleryRef.innerHTML = '';
}


refs.listGalleryRef.addEventListener('click', onImg);

function onImg(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  } 
    const instance = basicLightbox.create(
      `<img src="${e.target.dataset.src}"/>`
    );
    instance.show();
  }


let errorSetting = {
    text: "It's error",
    mode: "dark",
    closer: true,
    hide: true,
    sticker: false,
    addClass: "pnotify",
    delay: 2000,
  };
