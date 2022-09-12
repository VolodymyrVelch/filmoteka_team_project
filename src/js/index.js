// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

// Імпорти сюди

import { trendingFetch, getMoviesByQueryKey, fetchByID } from './apies';
import { cardsMarkup, modalOneFilmMarkup } from './movie-cards-markup';
import Pagination from 'tui-pagination';

// Тут додаємо ваші глобальні змінні
let queryString = '';
let items = [];
let page = 1;

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');
const container = document.getElementById('pagination');
const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');

// Тут додаємо слухачі подій
// document.addEventListener('click', onClickModalOpen);

searchInput.addEventListener('input', e => {
  queryString = e.target.value;
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  return getMoviesByQueryKey(queryString).then(data => renderByQuery(data));
});

// ========_____Пишемо сюди основні функції_____===============

// Pagination
// ==============================================================
// створюємо pagination event на  основі коструктора, та додаємо опції
const pagination = new Pagination(container, {
  totalItems: 1000,
  itemsPerPage: 10,
  visiblePages: 5,
  centerAlign: true,
});

// Отримуємо номер сторінки яку обрав коистувач за допомогою (блок пагінації)
pagination.on('afterMove', event => {
  const currentPage = event.page;
  // console.log(currentPage);
  render(currentPage);
});
// ==================================================================

// Функція для виклику карток за популярним рейтингом
async function render(currentPage) {
  const data = await trendingFetch(currentPage);
  items = data.results;
  // console.log('items', items);
  const createGAl = cardsMarkup(items);
  gallery.innerHTML = createGAl;
}
render(page);

// Функція для виклику карток за ключовим словом
function renderByQuery(filteredList) {
  const listOfCards = cardsMarkup(filteredList);
  return gallery.insertAdjacentHTML('afterbegin', listOfCards);
}

// Функція для рендеру модального вікна ОДНОГО ФІЛЬМУ
async function renderOneFilmModal(id) {
  const data = await fetchByID(id);
  // console.log(data);
  gallery.insertAdjacentHTML('afterend', modalOneFilmMarkup(data));
}

// Функція-колбек для рендеру модалки по кліку
async function onClickModalOpen(e) {
  e.preventDefault();
  if (!e.target.closest('.movie__card')) return;
  const movieID = e.target.closest('.movie__card').dataset.movieid;
  // console.log(movieID);
  openModalOneFilm(movieID);
}

async function openModalOneFilm(movieID) {
  await renderOneFilmModal(movieID);
  // const buton = document.querySelector('.button__secondary');
  // buton.addEventListener('click', onClickButon);
}

// async function onClickButon(e) {
//   // console.log(e.target.dataset.movieid);
//   const data = await fetchByID(e.target.dataset.movieid);
//   console.log(data);
// }
