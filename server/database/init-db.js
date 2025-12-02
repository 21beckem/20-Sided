import { MongoClient, ServerApiVersion } from "mongodb";
import DefaultMapJson from "./default-map.json" with { type: "json" };

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
    console.log("Collection 'users' dropped successfully");

    // create a new collection
    if ( !(await db.createCollection('maps')) ) {
        throw new Error("Collection 'maps' could not be created");
    }
    console.log("Collection 'maps' created successfully");

    // insert test user
    const now = new Date().toISOString();
    const result = await db.collection('maps').insertOne({
        title: 'My First Map',
        type: 'map',
        description: 'This is my first map. Yay!',
        owner: 'clerk-user-id',
        isPublic: true,
        map: DefaultMapJson,
        createdAt: now,
        updatedAt: now
    });
    
    console.log(`1 new listing created in 'users' with the following id:`, result.insertedId);
  } catch (error) {
    console.error(error.message);
  }
};

init();