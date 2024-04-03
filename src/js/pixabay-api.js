import axios from 'axios';

const API_KEY = '21675808-1204a02bf0a9f212ef3ae3caa';
const BASE_URL = 'https://pixabay.com/api/';

export async function getPixabayItems(query, page) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        q: query,
        page,
        per_page: 15,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        key: API_KEY,
      },
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
