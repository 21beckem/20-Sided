import * as utils from '../utils.js';
utils.mountOnEveryPage();
// import { WorldQuill } from 'http://localhost:5500/javascript/WorldQuill.js';
import { WorldQuill } from 'https://21beckem.github.io/WorldQuill/javascript/WorldQuill.js';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI || '';

// get the map id from search params
const urlParams = new URLSearchParams(window.location.search);
let mapId = urlParams.get('id'); // will be null if not found
let mapDoc = null;
let thisIsMyMap = false;
    
(async()=>{
    // fetch that map
    let worldData = null;
    if (mapId) {
        try {
            const fetching = await fetch(`${API_BASE_URL}/map/${mapId}`);
            let response = await fetching.json();
            if (!response.worked) return;
            mapDoc = response.result;
            worldData = response.result.map;
        } catch (error) {
            console.error(error);
        };
    }
    
    // WorldQuill init
    WorldQuill.init({
        containerSelector: 'div.WorldQuill',
        worldData: worldData
    });
})();
    
async function getAuthHeader () {
    await utils.waitForClerkToInit();
    if (window.clerk?.isSignedIn && window.clerk.user?.id) {
        return  {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.clerk.user.id}`
        };
    }
    return null;
}

function buildPayload(worldData, forcePromptForNewTitleAndDescription=false) {
    // preserve existing doc fields when editing
    const base = mapDoc ? {...mapDoc} : {};
    // never send _id back in the payload
    delete base._id;

    let title = base.title || worldData.title || 'Untitled';
    let description = base.description || worldData.description || '';

    thisIsMyMap = window.clerk?.user.id === base.author;
    if (thisIsMyMap || forcePromptForNewTitleAndDescription) {
        title = prompt('What would you like to name this map?', title) || title;
        description = prompt('Enter a description if you would like:', description) || description;
    }

    return {
        ...base,
        map: worldData,
        title,
        description,
        author_name: window.clerk?.user?.fullName || window.clerk?.user?.username,
        author: window.clerk?.user?.id
    };
}

async function persistMap(worldData) {
    const headers = await getAuthHeader();
    if (!headers)
        return alert('Please sign in to save your map.');

    const payload = buildPayload(worldData);
    const endpoint = thisIsMyMap ? `${API_BASE_URL}/map/${mapId}` : `${API_BASE_URL}/map`;
    const method = thisIsMyMap ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify({
            json: payload
        })
    });

    const result = await response.json();
    if (!response.ok || result.worked === false) {
        throw new Error(result.error || 'Failed to save map');
    }

    if (result.insertedId) {
        mapId = result.insertedId;
        urlParams.set('id', mapId);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    // keep latest map doc in memory for future saves
    mapDoc = {...payload};
}

async function saveToCollection(worldData) {
    const headers = await getAuthHeader();
    if (!headers)
        return alert('Please sign in to save to your collection.');

    const payload = buildPayload(worldData, true);

    const response = await fetch(`${API_BASE_URL}/map/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            json: payload
        })
    });

    const result = await response.json();
    if (!response.ok || result.worked === false) {
        throw new Error(result.error || 'Failed to save to collection');
    }
}
    
WorldQuill.onSave = async function(worldData) {
    try {
        await persistMap(worldData);
        console.log('Map saved successfully');
    } catch (err) {
        console.error(err);
        alert('Could not save map. Please try again.');
    }
};
    
WorldQuill.onSaveToCollection = async function(worldData) {
    try {
        await saveToCollection(worldData);
        console.log('Saved to collection:', worldData);
    } catch (err) {
        console.error(err);
        alert('Could not save to collection. Please try again.');
    }
};
