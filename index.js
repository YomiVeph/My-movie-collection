"use strict";
/* API CONFIG */
const API_KEY = "503ca19306327dfd0d0dcf4b158500ea";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";
const GENRE = 53;

/* DOM */
const moviesEl = document.getElementById("movies");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const favBtn = document.getElementById("favBtn");
const sort = document.getElementById("sort");

const modalEl = document.getElementById("modal");
const trailer = document.getElementById("trailer");
const details = document.getElementById("details");
const closeBtn = document.getElementById("close");

/* STATE */
let currentMovies = [];
let showFav = false;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* HELPERS */
const ratingColor = (v) => (v >= 7 ? "green" : v >= 5 ? "orange" : "red");
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  favBtn.textContent = showFav ? "All Movies" : "Favorites";
}
function isFavorite(id) {
  return favorites.some((movie) => movie.id === id);
}

/* FETCH MOVIES */
async function getMovies(type = "popular") {
  showLoader();
  let url =
    type === "latest"
      ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${GENRE}&sort_by=release_date.desc`
      : `${BASE_URL}/movie/${type}?api_key=${API_KEY}&with_genres=${GENRE}`;

  const res = await fetch(url);
  const data = await res.json();
  currentMovies = data.results || [];
  render();
}

/* RENDER */
function render() {
  let movies = showFav ? [...favorites] : [...currentMovies];

  if (sort.value === "high")
    movies.sort((a, b) => b.vote_average - a.vote_average);

  if (sort.value === "low")
    movies.sort((a, b) => a.vote_average - b.vote_average);

  showMovies(movies);
}

/* SHOW MOVIES */
function showMovies(movies) {
  moviesEl.innerHTML = "";

  if (!movies.length) {
    moviesEl.innerHTML = `<p style="grid-column:1/-1;text-align:center;">No movies found</p>`;
    return;
  }

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <span class="favorite ${
        favorites.some((f) => f.id === movie.id) ? "active" : ""
      }">
        ★
      </span>
      <img src="${
        movie.poster_path
          ? IMG + movie.poster_path
          : "https://via.placeholder.com/500x750?text=No+Image"
      }">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <span class="rating ${ratingColor(movie.vote_average)}">
          ${movie.vote_average.toFixed(1)}
        </span>
      </div>
      <div class="overview">${
        movie.overview || "No description available."
      }</div>
    `;

    /* Favorite */
    div.querySelector(".favorite").onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(movie, e.target);
    };

    /* Modal */

    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite")) return;
      openModal(movie.id);
    });

    moviesEl.appendChild(div);
    observer.observe(div);
  });
}

/* FAVORITES */
function toggleFavorite(movie, icon) {
  const exists = favorites.find((f) => f.id === movie.id);
  if (exists) {
    favorites = favorites.filter((f) => f.id !== movie.id);
    icon.classList.remove("active");
  } else {
    favorites.push(movie);
    icon.classList.add("active");
  }
  saveFavorites();
  icon.classList.add("pulse");
  setTimeout(() => icon.classList.remove("pulse"), 300);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  if (showFav) render();
}

/* MODAL */
async function openModal(id) {
  modalEl.style.display = "flex";
  trailer.src = "";
  details.innerHTML = "Loading...";

  /* VIDEOS */
  const v = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  const vd = await v.json();

  const video =
    vd.results.find((x) => x.site === "YouTube" && x.type === "Trailer") ||
    vd.results.find((x) => x.site === "YouTube" && x.type === "Teaser");

  if (video) {
    trailer.style.display = "block";
    trailer.src = `https://www.youtube.com/embed/${video.key}?autoplay=1`;
  } else {
    trailer.style.display = "none";
    details.innerHTML = `<p style="margin-bottom:1rem;color:#f87171;">
      No trailer available for this movie.
    </p>`;
  }

  /*  DETAILS  */
  const d = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
  );
  const data = await d.json();

  details.innerHTML += `
    <p><b>Runtime:</b> ${data.runtime || "N/A"} mins</p>
    <p><b>Release:</b> ${data.release_date || "N/A"}</p>
    <p><b>Cast:</b> ${
      data.credits?.cast
        ?.slice(0, 5)
        .map((c) => c.name)
        .join(", ") || "N/A"
    }</p>
  `;
}

closeBtn.onclick = () => {
  modalEl.style.display = "none";
  trailer.src = "";
};

/* SEARCH */
search.onkeyup = async () => {
  const q = search.value.trim();

  if (!q) {
    getMovies(filter.value || "popular");
    return;
  }

  const r = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${q}`
  );
  const d = await r.json();
  currentMovies = d.results || [];
  render();
};

/* EVENTS */
filter.onchange = () => getMovies(filter.value);
sort.onchange = render;
favBtn.onclick = () => {
  showFav = !showFav;
  favBtn.textContent = showFav ? "All Movies" : "Favorites";
  render();
};

/* LOADER */
function showLoader() {
  moviesEl.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    moviesEl.innerHTML += `
      <div class="movie">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:70%"></div>
      </div>
    `;
  }
}

/* SCROLL ANIMATION */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => e.isIntersecting && e.target.classList.add("show"));
  },
  { threshold: 0.2 }
);

/* INIT */
saveFavorites();
getMovies();
