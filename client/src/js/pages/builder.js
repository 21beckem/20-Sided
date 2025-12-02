import * as utils from '../utils.js';
utils.mountOnEveryPage();
// import { WorldQuill } from 'http://localhost:5500/javascript/WorldQuill.js';
import { WorldQuill } from 'https://21beckem.github.io/WorldQuill/javascript/WorldQuill.js';



// change this to load from server
const worldData = JSON.parse(localStorage.getItem('worldData'));

WorldQuill.init({
    containerSelector: 'div.WorldQuill',
    worldData: worldData
});

WorldQuill.onSave = function(worldData) {
    // change this to save to server
    localStorage.setItem('worldData', JSON.stringify(worldData));
};

WorldQuill.onSaveToCollection = function(worldData) {
    // save to server as new map
    //   maybe have a popup asking for name and/or description?
};