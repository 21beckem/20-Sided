import * as utils from '../utils.js';
utils.mountOnEveryPage();
// import { WorldQuill } from 'http://localhost:5500/javascript/WorldQuill.js';
import { WorldQuill } from 'https://21beckem.github.io/WorldQuill/javascript/WorldQuill.js';

// get the map id from search params
const urlParams = new URLSearchParams(window.location.search);
const mapId = urlParams.get('id'); // will be null if not found
    
(async()=>{
    // fetch that map
    let worldData = null;
    if (mapId) {
        try {
            const fetching = await fetch(`/api/map/${mapId}`);
            let response = await fetching.json();
            if (!response.worked) return;
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
    
WorldQuill.onSave = function(worldData) {
    // change this to save to server
    localStorage.setItem('worldData', JSON.stringify(worldData));
};

WorldQuill.onSaveToCollection = function(worldData) {
    // save to server as new map
    //   maybe have a popup asking for name and/or description?
    console.log('Saving to collection:', worldData);
};
