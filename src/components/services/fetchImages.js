import { http } from './api';
import apiSettings from './settings';

const { BASE_URL, API_KEY, TYPE, PER_PAGE } = apiSettings;


export const fetchImages = (name, galleryPage) => {
  return http.get(
    `${BASE_URL}${API_KEY}&q=${name}${TYPE}&orientation=horizontal&safesearch=true&page=${galleryPage}&${PER_PAGE}`
  );
};
