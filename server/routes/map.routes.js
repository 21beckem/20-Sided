import { Router } from 'express';
import mongodb from "../database/index.js";
import authorize from '../middleware/auth.middleware.js';
const router = Router();

// `POST /maps` - Create new map
router.post('/', authorize, async (req, res) => {
    if (!req.body || !req.body.json) {
        res.status(400).json({
            worked: false,
            error: 'Missing JSON'
        });
        return;
    }
    
    let json = false;
    try {
        json = JSON.parse(req.body.json);
        
    } catch (e) {
        res.status(400).json({
            worked: false,
            error: 'Invalid JSON'
        });
        return;
    }

    if (!json.map) {
        res.status(400).json({
            worked: false,
            error: 'Missing map'
        });
        return;
    }
    if (json.map.children.length === 0) {
        res.status(400).json({
            worked: false,
            error: 'Map must have at least one chunk'
        });
        return;
    }

    // set type based on number of chunks
    json.type = json.map.children.length > 1 ? 'map' : 'chunk';

    // set the owner
    json.owner = res.locals.uid;

    let result = await mongodb.getDb().collection('maps').insertOne(json);

    res.status(200).json(result);
});

// `GET /maps/:id` - Get specific map
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    let result = await mongodb.getDb().collection('maps').findOne({
        _id: new mongodb.ObjectId(id)
    });
    res.status(200).json({
        worked: true,
        result: result});
});

// - `PUT /maps/:id` - Update map
router.put('/:id', authorize, async (req, res) => {
    const {id} = req.params;

    // Validate ObjectId
    if (!mongodb.ObjectId.isValid(id)) {
        res.status(400).json({
            worked: false,
            error: 'Invalid map ID'
        });
        return;
    }

    if (!req.body || !req.body.json) {
        res.status(400).json({
            worked: false,
            error: 'Missing JSON'
        });
        return;
    }

    let json = false;
    try {
        json = JSON.parse(req.body.json);
    } catch (e) {
        res.status(400).json({
            worked: false,
            error: 'Invalid JSON'
        });
        return;
    }

    if (!json.map) {
        res.status(400).json({
            worked: false,
            error: 'Missing map'
        });
        return;
    }
    if (json.map.children.length === 0) {
        res.status(400).json({
            worked: false,
            error: 'Map must have at least one chunk'
        });
        return;
    }

    // Set type based on number of chunks
    json.type = json.map.children.length > 1 ? 'map' : 'chunk';

    // Update the document
    let result = await mongodb.getDb().collection('maps').updateOne(
        {
            _id: new mongodb.ObjectId(id),
            owner: res.locals.uid
        },
        { $set: json }
    );

    if (result.matchedCount === 0) {
        res.status(404).json({
            worked: false,
            error: 'Map not found'
        });
        return;
    }

    res.status(200).json({
        worked: true,
        modified: result.modifiedCount,
        id: id
    });
});



export default router; // Export the router to use it in the main file
