const API_KEY = '21675808-1204a02bf0a9f212ef3ae3caa';
const BASE_URL = 'https://pixabay.com';

export function getItems(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };
  const options = new URLSearchParams(params);
  return fetch(`${BASE_URL}/api/?${options}`).then(response => {
    if (!response.ok) {
      throw new Error('Ups... The word is wrong!');
    }

    return response.json();
  });
}
