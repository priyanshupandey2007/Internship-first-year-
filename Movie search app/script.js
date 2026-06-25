// Replace with your generated API key from OMDb API website
const API_KEY = 'f0ae740f'; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainContainer = document.getElementById('main');
const movieModal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeModal = document.querySelector('.close-modal');

// 1. Fetching Movie List via REST API (Using Async/Await)
async function fetchMovies(searchTerm) {
    mainContainer.innerHTML = `<div class="message">Searching...</div>`;
    
    try {
        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            mainContainer.innerHTML = `<div class="message">No movies found for "${searchTerm}". Try another title!</div>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        mainContainer.innerHTML = `<div class="message">Something went wrong. Please check your internet or API key.</div>`;
    }
}

// 2. Dynamic UI Rendering for Search Results
function displayMovies(movies) {
    mainContainer.innerHTML = ''; // Clear prior content

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        // Handle Missing Poster broken links elegantly
        const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster+Available';

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <div class="movie-meta">
                    <span>${movie.Year}</span>
                    <span style="text-transform: capitalize;">${movie.Type}</span>
                </div>
            </div>
        `;

        // Event listener to trigger deeper lookup when a card is clicked
        movieCard.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
        
        mainContainer.appendChild(movieCard);
    });
}

// 3. Deeper Lookup for Target Movie Details
async function fetchMovieDetails(imdbId) {
    try {
        const response = await fetch(`${BASE_URL}&i=${imdbId}&plot=full`);
        const movie = await response.json();
        
        if (movie.Response === "True") {
            showModal(movie);
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}

// 4. Modal Window Generation with Dynamic Content
function showModal(movie) {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster+Available';

    modalDetails.innerHTML = `
        <div class="modal-flex">
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="modal-info">
                <h2>${movie.Title}</h2>
                <p><strong>Released:</strong> ${movie.Released} (${movie.Runtime})</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <div>
                    <span class="rating-tag">⭐ IMDb Rating: ${movie.imdbRating}/10</span>
                </div>
            </div>
        </div>
    `;
    
    movieModal.style.display = 'flex';
}

// 5. App Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Close Modal functionality
closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

// Close modal if user clicks anywhere outside the card interface
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = 'none';
    }
});