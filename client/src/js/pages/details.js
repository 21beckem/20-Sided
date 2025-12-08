import * as utils from '../utils.js';
utils.mountOnEveryPage();

async function retrieveDetails () {
    const params = new URLSearchParams(window.location.search);
    try {
        const response = await fetch(`/api/map/${params.get('id')}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.worked) {
            createItemDetails(data.result);
        } else {
            new Error(data.error || 'Failed to fetch results');
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        new Error('Failed to load results. Please try again.');
    }
}

function createItemDetails (result) {
    // select document elements and add them dynamically
    const itemName = document.querySelector('.item-name');
    itemName.innerHTML = result.title;
    const itemInfo = document.querySelector('.item-info');
    itemInfo.innerHTML = result.description;
    const type = document.querySelector('.type');
    type.innerHTML = '<b>Type:</b> ' + (result.type || 'Unknown');
    const author = document.querySelector('.author');
    author.innerHTML = '<b>Author:</b> ' + (result.author_name || 'Unknown');
    const itemContainer = document.querySelector('.item-detail-container');
    const previewImage = document.querySelector('.preview-img');

    // set image (iframe)
    let jsonString = utils.isObjectEmpty(result.map) ? '' : encodeURIComponent(JSON.stringify(result.map));
    previewImage.src = `https://21beckem.github.io/WorldQuill/preview.html?timestamp=${Date.now()}#${jsonString}`;

    // set button links 
    const editButtonUrl = `/builder/?id=${result._id}`;
    const editButton = document.querySelector('#edit-btn')
    editButton.setAttribute("href", editButtonUrl)

    const copyButton = document.querySelector('#copy-btn')
    copyButton.addEventListener('click', async () => {
        let jsonString = utils.isObjectEmpty(result.map) ? '' : JSON.stringify(result.map);
        try {
        let res = await navigator.clipboard.writeText(jsonString);
        console.log('copy response: ', res);
        alert('Copied to Clipboard!')
        } catch (error) {
            console.error('Error fetching results:', error);
            throw new Error('Failed to load results. Please try again.');
        }
    });
}

async function renameTitle(result) {
    try {
    const itemTitle = document.querySelector('.item-name');
    itemTitle.addEventListener('input', async () => {
        itemTitle.textContent = `${result.title}`
    })
    } catch (error) {
        throw new Error('Failed to change title.')
    }
}

async function editDescription() {
    const descriptionButton = document.querySelector('#desc-btn')
    const itemDescription = document.querySelector('#item-info')
    descriptionButton.addEventListener('change', async () => {
        
    })
}

const renameButton = document.querySelector('#rename-btn');
renameButton.addEventListener('click', renameTitle);

retrieveDetails()