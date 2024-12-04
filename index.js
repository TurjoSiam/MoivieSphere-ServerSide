const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0g53.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

        const database = client.db("MovieSphere").collection("allMovies")



        app.post('/allmovies', async(req, res) => {
            const newMovie = req.body;
            console.log(newMovie);
            const result = await database.insertOne(newMovie);
            res.send(result);
        })



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.log('ERROR:', error);
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send('server is running');
});

app.listen(port, () => {
    console.log(`server is running in port ${port}`);
})

