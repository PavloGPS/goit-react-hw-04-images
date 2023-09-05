import axios from 'axios';

const BASE_URL = `https://pixabay.com/api/`;
const key = '35881425-29f70e74d3fcf7112678d9ed3';
const perPage = 12;

async function fetchGallery(searchQuery, page) {
  try {
    const resp = await axios.get(
      `${BASE_URL}?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    const gallery = resp.data.hits;

    return gallery;
  } catch (error) {
    throw new Error(error);
  }
}

export { fetchGallery, perPage };
