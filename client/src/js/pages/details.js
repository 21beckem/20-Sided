import * as utils from '../utils.js';
utils.mountOnEveryPage();
import { isObjectEmpty } from '../utils.js';


async function retrieveDetails () {
    const params = new URLSearchParams({
        type: window.location.search
    })
    try {
        const response = await fetch(`/api/map/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.worked) {
            createItemDetails(data.results);
        } else {
            new Error(data.error || 'Failed to fetch results');
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        new Error('Failed to load results. Please try again.');
    }
}

function createItemDetails (result) {
    
    const itemContainer = document.querySelector('.item-detail-container')
    const previewImage = document.querySelector('.preview-img')
    let jsonString = isObjectEmpty(result.map) ? '' : encodeURIComponent(JSON.stringify(result.map));
    previewImage.innerHTML = `
<iframe src="https://21beckem.github.io/WorldQuill/preview.html?timestamp=${Date.now()}#${jsonString}" alt="${result.title || 'Untitled'}"></iframe>
`
}