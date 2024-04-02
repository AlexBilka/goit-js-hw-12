// ================ import modules ================

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPixabayItems } from './js/pixabay-api';
import { galleryMarkup } from './js/render-functions';

// ============= document elements =============

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMorebtn = document.querySelector('.load-more');

form.addEventListener('submit', handleSubmit);
loadMorebtn.addEventListener('click', handleClick);

// =========== SimpleLightbox initialization ===========

const lightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 250,
  overlay: true,
  overlayOpacity: 0.7,
});

let page = 1;
let query = '';

// ============= Submit function =============

function handleSubmit(event) {
  event.preventDefault();

  loadMorebtn.classList.add('is-hidden');
  loaderPlay();
  gallery.innerHTML = ''; // Clear gallery
  page = 1;
  query = event.target['queryInput'].value.trim();

  if (query !== '') {
    getPixabayItems(query, page)
      // -----------------------------------------
      .then(response => {
        if (response.hits.length === 0) {
          return iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
          });
        }
        gallery.innerHTML = galleryMarkup(response.hits); // Create markup
        if (response.total > 15) {
          loadMorebtn.classList.remove('is-hidden');
        }
        lightbox.refresh();
      })

      .catch(error => {
        console.log(error);
      })

      .finally(() => {
        loaderStop();
      });

    // --------------------------------------------
  } else {
    loaderStop();
    iziToast.info({
      message: 'Please, enter a query, for example "cats"',
      position: 'topLeft',
    });
  }

  event.currentTarget.reset(); // clear input value
}

// ============= Load more functions =============

function handleClick() {
  loaderPlay();
  page += 1;

  getPixabayItems(query, page)
    // --------------------------------------------
    .then(response => {
      const lastPage = Math.ceil(response.total / 15);
      gallery.insertAdjacentHTML('beforeend', galleryMarkup(response.hits)); // Create markup

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (lastPage === page) {
        loadMorebtn.classList.add('is-hidden');
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topLeft',
        });
      }
    })

    .catch(error => {
      console.log(error);
    })

    .finally(() => {
      loaderStop();
    });
}

// ============= Loader functions =============

function loaderPlay() {
  loader.classList.remove('is-hidden');
}
function loaderStop() {
  loader.classList.add('is-hidden');
}
