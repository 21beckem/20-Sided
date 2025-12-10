import * as utils from '../utils.js';
utils.mountOnEveryPage();

const API_BASE_URL = import.meta.env.VITE_SERVER_URI || '';

// Get DOM elements
const searchInput = document.querySelector('section.search input.search');
const typeSelect = document.querySelector('select[name="type"]');
const authorSelect = document.querySelector('select[name="author"]');
const resultsHeader = document.querySelector('section.results > header');
const resultsSection = document.querySelector('section.results #results');

// Debounce function to prevent too many API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch search results from the backend
async function fetchResults() {
    const query = searchInput.value.trim();
    const type = typeSelect.value;
    const author = authorSelect.value;
    const limit = 25;

    // Wait until Clerk is mounted
    await utils.waitForClerkToInit();

    // hide me option if not signed in
    if (!window.clerk.isSignedIn) {
        document.querySelector('section.filter .author-dropdown').style.cssText = 'opacity: 0.5; pointer-events: none';
    }
    
    const params = new URLSearchParams({
        type,
        author: author === 'me' && window.clerk.isSignedIn ? window.clerk.user.id : author,
        limit: limit.toString()
    });

    // Only add query param if there's a search term
    if (query) {
        params.append('query', query);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.worked) {
            displayResults(data.results, data.count);
        } else {
            displayError(data.error || 'Failed to fetch results');
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        displayError('Failed to load results. Please try again.');
    }
}

// Display search results
function displayResults(results, count) {

    resultsSection.innerHTML = '';

    // Update header with count
    resultsHeader.textContent = `Results (${count})`;

    if (results.length === 0) {
        return displayError('No results found');
    }

    resultsSection.innerHTML = results.map(createResultCard).join('');
}

// Create a card for each result
function createResultCard(result) {
    let jsonString = utils.isObjectEmpty(result.map) ? '' : encodeURIComponent(JSON.stringify(result.map));
    return `
        <a class="result-card" href="/details/?id=${result._id}">
            <iframe src="https://21beckem.github.io/WorldQuill/preview.html?timestamp=${Date.now()}#${jsonString}" alt="${result.title || 'Untitled'}"></iframe>
            <div class="details">
                <h3>${result.title || 'Untitled'}</h3>
                <p>${result.description || 'No description available'}</p>
                <div class="meta">
                    <span class="type" style="margin-right: 1rem;"><b>Type:</b> ${result.type || 'Unknown'}</span>
                    <span class="author"><b>Author:</b> ${result.author_name || 'Unknown'}</span>
                </div>
            </div>
        </a>
    `;
}

// Display error message
function displayError(message) {
    resultsSection.innerHTML = '<div class="result-card error">' + message + '</div>';
}

// Debounced search function (300ms delay)
const debouncedSearch = debounce(fetchResults, 300);

// Event listeners
searchInput.addEventListener('input', debouncedSearch);
typeSelect.addEventListener('change', fetchResults);
authorSelect.addEventListener('change', fetchResults);


// Load filters from URL
new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key === 'type') {
        typeSelect.value = value;
    } else if (key === 'author') {
        authorSelect.value = value;
    }
});

// Initial load
fetchResults();