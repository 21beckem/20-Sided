import * as utils from '../utils.js';
utils.mountOnEveryPage();
// import { WorldQuill } from 'http://localhost:5500/javascript/WorldQuill.js';
import { WorldQuill } from 'https://21beckem.github.io/WorldQuill/javascript/WorldQuill.js';

// get the map id from search params
const urlParams = new URLSearchParams(window.location.search);
let mapId = urlParams.get('id'); // will be null if not found
let mapDoc = null;
    
(async()=>{
    // fetch that map
    let worldData = null;
    if (mapId) {
        try {
            const fetching = await fetch(`/api/map/${mapId}`);
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
        return `Bearer ${window.clerk.user.id}`;
    }
    return null;
}

function buildPayload(worldData) {
    // preserve existing doc fields when editing
    const base = mapDoc ? {...mapDoc} : {};
    // never send _id back in the payload
    delete base._id;

    return {
        ...base,
        map: worldData,
        title: base.title || worldData.title || 'Untitled',
        description: base.description || worldData.description || '',
        author: base.author || window.clerk?.user?.fullName || window.clerk?.user?.username || window.clerk?.user?.id,
    };
}

async function persistMap(worldData) {
    const authHeader = await getAuthHeader();
    if (!authHeader) {
        alert('Please sign in to save your map.');
        return;
    }

    const payload = buildPayload(worldData);
    const endpoint = mapId ? `/api/map/${mapId}` : '/api/map';
    const method = mapId ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        body: JSON.stringify({
            json: JSON.stringify(payload)
        })
    });

    const result = await response.json();
    if (!response.ok || result.worked === false) {
        throw new Error(result.error || 'Failed to save map');
    }

    if (!mapId && result.insertedId) {
        mapId = result.insertedId;
        urlParams.set('id', mapId);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    // keep latest map doc in memory for future saves
    mapDoc = {...payload};
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
        await persistMap(worldData);
        console.log('Saved to collection:', worldData);
    } catch (err) {
        console.error(err);
        alert('Could not save map. Please try again.');
    }
};
