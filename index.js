require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xd8r6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const gamerCollection = client.db("gameDB").collection("gamer");
        const watchListCollection = client.db("gameDB").collection("watchList");
        const testimonialsCollection = client.db("gameDB").collection("testimonials");
        
        app.get('/highsRating', async(req, res)=>{
            const cursor = gamerCollection.find({}).sort({rating: -1}).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/gamers', async(req, res)=>{
            const cursor = gamerCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // details
        app.get('/gamers/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await gamerCollection.findOne(query);
            res.send(result);
        })

        app.get('/gamer/:email', async(req, res)=>{
            const email = req.params.email;
            const query = { email };
            const cursor = gamerCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/watchList/:email', async(req, res)=>{
            const email = req.params.email;
            const query = { email };
            const cursor = watchListCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/updateReview/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await gamerCollection.findOne(query);
            res.send(result);
        })
        
        // testimonials
        app.get('/testimonials', async(req, res)=>{
            const cursor = testimonialsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        
        app.post('/gamers', async(req, res)=>{
            const newGamer = req.body;
            const result = await gamerCollection.insertOne(newGamer);
            res.send(result);
        })

        app.post('/watchList', async(req, res)=>{
            const watchList = req.body;
            const result = await watchListCollection.insertOne(watchList);
            res.send(result);
        })

        app.put('/updateReview/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updatedReview = req.body;
            const review = {
                $set: {
                    photo: updatedReview.photo, 
                    name: updatedReview.name, 
                    description: updatedReview.description, 
                    rating: updatedReview.rating, 
                    year: updatedReview.year, 
                    genres: updatedReview.genres
                }
            }
            const result = await gamerCollection.updateOne(filter, review, options);
            res.send(result);
        })

        app.delete('/gamers/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await gamerCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('chill gamer server is running');
})

app.listen(port, () => {
    console.log(`chill gamer server is running on port ${port}`);
})