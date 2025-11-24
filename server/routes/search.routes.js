import { Router } from 'express';
import mongodb from "../database/index.js";

const router = Router();


// ### Search
// - `GET /search` - Search all maps
//    - Search params:
//       - `type`:  *String/Enum* -> `all`, `map`, `chunk`
//       - `author`:  *String/Enum* -> `anyone`, `me`
//       - `limit`:  *int*
//       - `query`:  *String*
//    - Defaults:
//       - `type`:  `all`
//       - `author`:  `anyone`
//       - `limit`:  `25`
//       - `query`:  (don't filter by text at all)


// GET 
router.get('/all', async (req, res) => {
    // return all maps
    let result = await mongodb.getDb().collection('maps').find().toArray();
    res.status(200).json({
        result
    });
});

router.get('/', async (req, res) => {
    const {
        type = 'all',
        author = 'anyone',
        limit = 25,
        query = ''
    } = req.query;
    res.status(200).json(
        {worked: true}
    );
});

export default router;

