import * as utils from '../utils.js';
utils.mountOnEveryPage();

// Get DOM elements
const searchInput = document.querySelector('section.search input.search');
const typeSelect = document.querySelector('select[name="type"]');
const authorSelect = document.querySelector('select[name="author"]');
const resultsSection = document.querySelector('section.results');

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
    // Clear previous results except the header
    const header = resultsSection.querySelector('header');
    resultsSection.innerHTML = '';
    resultsSection.appendChild(header);

    // Update header with count
    header.textContent = `Results (${count})`;

    if (results.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found';
        noResults.style.padding = '1rem';
        noResults.style.textAlign = 'center';
        noResults.style.color = 'var(--scroll-font-color)';
        resultsSection.appendChild(noResults);
        return;
    }

    // Create result cards
    results.forEach(result => {
        const card = createResultCard(result);
        resultsSection.appendChild(card);
    });
}

// Create a card for each result
function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.cssText = `
        padding: 1rem;
        margin: 0.5rem 1rem;
        border: 1px solid var(--scroll-accent-color);
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    `;

    const title = document.createElement('h3');
    title.textContent = result.title || 'Untitled';
    title.style.cssText = `
        margin: 0 0 0.5rem 0;
        color: var(--scroll-accent-color);
        font-family: var(--scroll-font);
    `;

    const description = document.createElement('p');
    description.textContent = result.description || 'No description available';
    description.style.cssText = `
        margin: 0 0 0.5rem 0;
        color: var(--scroll-font-color);
        font-size: 0.9em;
    `;

    const meta = document.createElement('div');
    meta.style.cssText = `
        display: flex;
        gap: 1rem;
        font-size: 0.8em;
        color: var(--scroll-accent-color);
        opacity: 0.7;
    `;

    const typeSpan = document.createElement('span');
    typeSpan.textContent = `Type: ${result.type || 'unknown'}`;

    const chunksSpan = document.createElement('span');
    const chunkCount = result.map?.children?.length || 0;
    chunksSpan.textContent = `Chunks: ${chunkCount}`;

    meta.appendChild(typeSpan);
    meta.appendChild(chunksSpan);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.backgroundColor = 'rgba(var(--scroll-accent-color-rgb, 255, 255, 255), 0.1)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.backgroundColor = 'transparent';
    });

    // Navigate to map detail page on click
    card.addEventListener('click', () => {
        if (result._id) {
            window.location.href = `/map/${result._id}`;
        }
    });

    return card;
}

// Display error message
function displayError(message) {
    const header = resultsSection.querySelector('header');
    resultsSection.innerHTML = '';
    resultsSection.appendChild(header);

    header.textContent = 'Results';

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