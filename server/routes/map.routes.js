import { Router } from 'express';
import mongodb from "../database/index.js";
const router = Router();

// `POST /maps` - Create new map
router.post('/', async (req, res) => {
    res.status(200).json({
        worked: true
    });
});

// `GET /maps/:id` - Get specific map
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    let result = await mongodb.getDb().collection('maps').findOne({
        _id: new mongodb.ObjectId(id)
    });
    res.status(200).json({
        worked: true,
        id: id,
        result: result
    });
});

// - `PUT /maps/:id` - Update map
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    res.status(200).json({
        worked: true,
        id: id
    });
});


export default router; // Export the router to use it in the main file


//(map/chunk type will be determined by counting number of chunks)
