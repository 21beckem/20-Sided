import { MongoClient, ServerApiVersion } from "mongodb";
import DefaultMapJsons from "./default-maps.json" with { type: "json" };

//build the uri for our connection string
const uri = process.env.MONGO_URI || "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//define the init function to connect to our database and create collections
const init = async () => {
  try {
    await client.connect();
    console.log(`Connected to MongoDB`);
    // get a reference to the actual database we will be using with .db(<database name>)
   	const db = client.db(process.env.MONGO_DATABASE);

    // initialize collections
    await seedMaps(db);

    console.log('\n\n  Database initialized!\n');
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.close();
  }
};

const seedMaps = async (db) => {
  try {
    // drop the collection to clear out the old records
    if ( !(await db.collection('maps').drop()) ) {
        throw new Error("Collection 'maps' could not be dropped");
    }
    console.log("Collection 'maps' dropped successfully");

    // create a new collection
    if ( !(await db.createCollection('maps')) ) {
        throw new Error("Collection 'maps' could not be created");
    }
    console.log("Collection 'maps' created successfully");

    // insert test user
    const now = new Date().toISOString();
    const result = await db.collection('maps').insertMany(DefaultMapJsons.map(m => {return {
        ...m,
        type: (m.map.children.length > 1) ? 'map' : 'chunk',
        author: 'default-maps-user-id',
        createdAt: now,
        updatedAt: now
    }}));
    
    console.log(`${result.insertedCount} new listing(s) created in 'maps' with the following ids:`, result.insertedIds);
  } catch (error) {
    console.error(error.message);
  }
};

init();