# 🎬 Movie Connections

A modern **movie discovery web app** built with **Vanilla JavaScript**, powered by the **TMDB API**. The app focuses on **Thriller movies**, smooth animations, and a complete **Favorites system** with persistence.

---

## 🚀 Live Features

* 🔍 **Search movies** in real time
* 🎭 **Filter by category** (Popular, Top Rated, Latest)
* ⭐ **Add / remove favorites** (saved in localStorage)
* 📊 **Favorites counter** with empty-state handling
* 🎞 **Movie trailers modal** (Trailer → Teaser → fallback)
* 🧠 **Persistent state** after page refresh
* 🎨 **Hover effects & scroll animations**
* ⏳ **Skeleton loaders** for better loading UX
* 📱 **Fully responsive layout**

---

## 🛠 Tech Stack

* **HTML5** – Semantic structure
* **CSS3** – Grid, animations, responsive design
* **JavaScript (ES6+)** – State management & DOM logic
* **TMDB API** – Movies, trailers, metadata
* **LocalStorage** – Favorites persistence

> ⚠️ No frameworks used (pure JavaScript)

---

## 📂 Project Structure

```
movie-connections/
│
├── index.html
├── styles.css
├── index.js
└── README.md
```

---

## ⭐ Favorites System (How it Works)

* Each movie can be starred ⭐
* Favorites are stored as **full movie objects**
* Data is persisted using `localStorage`
* Favorites can be viewed independently of API results

```js
{
  id,
  title,
  poster_path,
  vote_average
}
```

---

## 🎞 Trailer Handling Logic

Not all movies have trailers on TMDB. The app uses a **professional fallback strategy**:

1. Try to load **YouTube Trailer**
2. Fallback to **Teaser**
3. If none exists → show friendly message

This matches how real-world apps like IMDb and Netflix behave.

---

## ⏳ Skeleton Loaders

Skeleton cards are shown while data is loading to:

* Improve perceived performance
* Avoid layout shifts
* Provide modern UX feedback

---

## 📱 Responsive Design

* CSS Grid with `auto-fit` & `minmax`
* Mobile-first layout
* Optimized for small screens

---

## 🔐 API Usage

This project uses the **TMDB API**.

* Movies endpoint
* Videos endpoint
* Search endpoint

> API key is required and should be kept private in production apps.

---

## 🧠 Key Learnings

* Managing application state without frameworks
* Handling unreliable API data defensively
* Building reusable UI logic
* Persisting user data locally
* Creating smooth UX with animations

---

## 📌 Future Improvements

* Infinite scroll / pagination
* Rating range filter
* Theme toggle (dark/light)
* User profiles
* Backend authentication

---

## 🙌 Author

**Abayomi Odusanya**
Frontend Developer | JavaScript Enthusiast

---

## ⭐ Acknowledgement

Movie data provided by **The Movie Database (TMDB)**.

> This product uses the TMDB API but is not endorsed or certified by TMDB.
