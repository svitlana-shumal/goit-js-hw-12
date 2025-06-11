import axios from 'axios';

const myKey = '50779054-370421c42d6be36ab94d11a5f';
const url = 'https://pixabay.com/api/';
const perPage = 20;

export async function getImagesByQuery(query, page) {
  const params = {
    key: myKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again!'
    );
  }
}
