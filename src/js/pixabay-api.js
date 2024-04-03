import axios from 'axios';

export async function getPixabayItems(query, page) {
  axios.defaults.baseURL = 'https://pixabay.com/api/';
  const API_KEY = '21675808-1204a02bf0a9f212ef3ae3caa';
  const params = {
    key: API_KEY,
    q: query,
    page,
    per_page: 15,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };
  const options = new URLSearchParams(params);

  const res = await axios.get(`?${options}`);
  try {
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
