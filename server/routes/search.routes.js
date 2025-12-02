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

    // Build MongoDB filter
    let filter = {};

    // Filter by type (all, map, chunk)
    if (type !== 'all') {
        if (type === 'map' || type === 'chunk') {
            filter.type = type;
        } else {
            res.status(400).json({
                worked: false,
                error: 'Invalid type parameter. Must be "all", "map", or "chunk"'
            });
            return;
        }
    }

    // Filter by author (anyone, [user id])
    if (author !== 'anyone') {
        filter.owner = author;
    }

    // Filter by text query (search in title and description)
    if (query && query.trim() !== '') {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    // Convert limit to number and validate
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1) {
        res.status(400).json({
            worked: false,
            error: 'Invalid limit parameter. Must be a positive integer'
        });
        return;
    }

    // Execute search query
    let result = await mongodb.getDb()
        .collection('maps')
        .find(filter)
        .limit(limitNum)
        .toArray();

    res.status(200).json({
        worked: true,
        count: result.length,
        results: result
    });
});

export default router;

