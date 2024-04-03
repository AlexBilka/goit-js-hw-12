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

async function handleSubmit(event) {
  event.preventDefault();

  loaderPlay();
  loadMorebtn.classList.add('is-hidden');
  gallery.innerHTML = ''; // Clear gallery
  page = 1;
  query = event.target['queryInput'].value.trim();

  if (query !== '') {
    // --------------------------------------------
    try {
      const res = await getPixabayItems(query, page);
      if (res.hits.length === 0) {
        loaderStop();
        return iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }
      gallery.innerHTML = galleryMarkup(res.hits); // Create markup
      if (res.total > 15) {
        loadMorebtn.classList.remove('is-hidden');
      }
      lightbox.refresh();
      event.target['queryInput'].value = ''; // clear input value
      // --------------------------------------------
    } catch (err) {
      console.log(err);
    }
    // --------------------------------------------
  } else {
    iziToast.info({
      message: 'Please, enter a query, for example "cats"',
      position: 'topLeft',
    });
  }
  loaderStop();
}

// ============= Load more function =============

async function handleClick() {
  loaderPlay();
  page += 1;
  // --------------------------------------------
  try {
    const res = await getPixabayItems(query, page);
    const lastPage = Math.ceil(res.total / 15);
    gallery.insertAdjacentHTML('beforeend', galleryMarkup(res.hits)); // Create markup
    lightbox.refresh();

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
    // --------------------------------------------
  } catch (err) {
    console.log(err);
  }

  loaderStop();
}

// ============= Loader functions =============

function loaderPlay() {
  loader.classList.remove('is-hidden');
}
function loaderStop() {
  loader.classList.add('is-hidden');
}
