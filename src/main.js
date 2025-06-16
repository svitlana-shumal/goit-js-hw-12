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
const loadBtn = document.querySelector('.load-button');

let perPage = 15;
let currentQuery = '';
let currentPage = 1;

function hideLoadBtn() {
  loadBtn.classList.add('hidden');
}

function showLoadBtn() {
  loadBtn.classList.remove('hidden');
}

function getTotalPages(totalHits, perPage) {
  return Math.ceil(totalHits / perPage);
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

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  showLoader();
  hideLoadBtn();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, perPage);
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadBtn();
    } else {
      createGallery(hits);
      showLoadBtn();
    }
    if (currentPage >= getTotalPages(totalHits, perPage)) {
      hideLoadBtn();
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
loadBtn.addEventListener('click', async () => {
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

    if (currentPage >= getTotalPages(data.totalHits, perPage)) {
      hideLoadBtn();
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
