import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadButton = document.querySelector('.load-button');

let currentPage = 1;
let perPage = 15;
let currentQuery = '';

function hideLoadButton() {
  if (loadButton) {
    loadButton.classList.add('hidden');
  }
}

function showLoadButton() {
  if (loadButton) {
    loadButton.classList.remove('hidden');
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const queryInput = event.target.elements['search-text'];
  const query = queryInput ? queryInput.value.trim() : '';
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  currentQuery = query;

  clearGallery();
  showLoader();
  hideLoadButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, perPage);
    const { hits } = data;
    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadButton();
    } else {
      createGallery(hits);
      showLoadButton();
    }

    const totalPages = Math.ceil(data.totalHits / perPage);
    if (currentPage >= totalPages) {
      hideLoadButton();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message:
        error.response?.data?.message ||
        'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadButton.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, perPage);
    createGallery(data.hits);

    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const itemHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: itemHeight * 2,
        behavior: 'smooth',
      });
    }
    const totalPages = Math.ceil(data.totalHits / perPage);
    if (currentPage >= totalPages) {
      hideLoadButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
