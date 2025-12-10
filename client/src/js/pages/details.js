import * as utils from '../utils.js';
utils.mountOnEveryPage();

const API_BASE_URL = import.meta.env.VITE_SERVER_URI || '';
const params = new URLSearchParams(window.location.search);
let mapDoc = null;

async function retrieveDetails () {
    try {
        const response = await fetch(`${API_BASE_URL}/map/${params.get('id')}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.worked) {
            mapDoc = data.result;
            createItemDetails(data.result, true);
        } else {
            new Error(data.error || 'Failed to fetch results');
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        new Error('Failed to load results. Please try again.');
    }
}

async function createItemDetails(result, regeneratePreviewImg) {
    // select document elements and add them dynamically
    document.querySelector('.item-name').value = result.title;
    document.querySelector('.item-info').value = result.description;
    document.querySelector('.type').innerHTML = '<b>Type:</b> ' + (result.type || 'Unknown');
    document.querySelector('.author').innerHTML = '<b>Author:</b> ' + (result.author_name || 'Unknown');

    // set image (iframe)
    if (regeneratePreviewImg) {
        let jsonString = utils.isObjectEmpty(result.map) ? '' : encodeURIComponent(JSON.stringify(result.map));
        document.querySelector('.preview-img').src = `https://21beckem.github.io/WorldQuill/preview.html?timestamp=${Date.now()}#${jsonString}`;
    }

    // set button actions 
    document.querySelector('#edit-btn').href = `/builder/?id=${result._id}`;
    
    // show/hide enable/disable stuff
    if (result.type === 'chunk')
        document.querySelector('#copy-btn').style.display = 'unset';
    else
        document.querySelector('#copy-btn').style.display = 'none';
    await utils.waitForClerkToInit();
    if (window.clerk.user.id === result.author) {
        document.querySelector('.item-name').disabled = false;
        document.querySelector('.item-info').disabled = false;
        document.querySelector('#delete-btn').style.display = 'unset';
    } else {
        document.querySelector('.item-name').disabled = true;
        document.querySelector('.item-info').disabled = true;
        document.querySelector('#delete-btn').style.display = 'none';
    }
}

function createEventListeners() {
    document.querySelector('.item-name').addEventListener('change', (e) => putUpdate('title', e.target.value));
    document.querySelector('.item-info').addEventListener('change', (e) => putUpdate('description', e.target.value));

    document.querySelector('#delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this map?')) {
            const response = await fetch(`${API_BASE_URL}/map/${params.get('id')}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.clerk.user.id}`
                }
            });
            const result = await response.json();
            if (!response.ok || result.worked === false) {
                return alert('There an error. ' + (result.error || 'Please try again.'));
            }
            window.location.href = '/browse/';
        }
    });

    document.querySelector('#copy-btn').addEventListener('click', async () => {
        let jsonString = utils.isObjectEmpty(mapDoc.map) ? '' : JSON.stringify(mapDoc.map);
        try {
            await navigator.clipboard.writeText(jsonString);
        } catch (error) {
            alert('Failed to copy to clipboard. Please try again.');
        }
    });
}

async function putUpdate(attrToUpdate, newValue) {
    document.activeElement.blur();
    const newData = {...mapDoc};
    delete newData._id;
    newData[attrToUpdate] = newValue;
    const response = await fetch(`${API_BASE_URL}/map/${params.get('id')}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.clerk.user.id}`
        },
        body: JSON.stringify({
            json: newData
        })
    });
    const result = await response.json();
    if (!response.ok || result.worked === false) {
        createItemDetails(mapDoc, false);
        return alert('There an error. ' + (result.error || 'Please try again.'));
    }

    newData._id = result.id;
    mapDoc = {...newData};
    createItemDetails(mapDoc, false);
}


retrieveDetails();
createEventListeners();