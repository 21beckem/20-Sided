import * as utils from '../utils.js';
utils.mountOnEveryPage();

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

    // Build query string
    const params = new URLSearchParams({
        type,
        author,
        limit: limit.toString()
    });

    // Only add query param if there's a search term
    if (query) {
        params.append('query', query);
    }

    try {
        const response = await fetch(`/api/search?${params.toString()}`);

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
        resultsSection.innerHTML = '<div class="result-card error">No results found</div>';
        return;
    }

    resultsSection.innerHTML = results.map(createResultCard).join('');
}

function isObjectEmpty(obj) {
  // First, ensure the input is a non-null object
  if (obj === null || typeof obj !== 'object') {
    return false; // Or throw an error, depending on desired behavior
  }
  return Object.keys(obj).length === 0;
}

// Create a card for each result
function createResultCard(result) {
    let jsonString = isObjectEmpty(result.map) ? '' : encodeURIComponent(JSON.stringify(result.map));
    return `
        <a class="result-card" href="/map/${result._id}">
            <iframe src="https://21beckem.github.io/WorldQuill/preview.html?timestamp=${Date.now()}#${jsonString}" alt="${result.title || 'Untitled'}"></iframe>
            <div class="details">
                <h3>${result.title || 'Untitled'}</h3>
                <p>${result.description || 'No description available'}</p>
                <div class="meta">
                    <span class="type">${result.type || 'Unknown'}</span>
                    <span class="author">${result.author || 'Unknown'}</span>
                </div>
            </div>
        </a>
    `;
}

// Display error message
function displayError(message) {

    resultsHeader.innerHTML = 'Results';

    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem;
        background-color: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 4px;
        color: #ff6b6b;
    `;
    errorDiv.textContent = message;
    resultsSection.appendChild(errorDiv);
}

// Debounced search function (300ms delay)
const debouncedSearch = debounce(fetchResults, 300);

// Event listeners
searchInput.addEventListener('input', debouncedSearch);
typeSelect.addEventListener('change', fetchResults);
authorSelect.addEventListener('change', fetchResults);

// Initial load
fetchResults();