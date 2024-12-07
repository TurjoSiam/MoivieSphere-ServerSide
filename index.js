const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        app.get('/allmovies', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/featuredmovies', async (req, res) => {
            const cursor = database.find().sort({ rating: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/allmovies/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await database.findOne(query);
            res.send(result);
        })

        app.get('/allmovies/updatemovie/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await database.findOne(query);
            res.send(result);
        })

        app.put('/allmovies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedMovie = req.body;
            const update = {
                $set: {
                    title: updatedMovie.title,
                    year: updatedMovie.year,
                    genre: updatedMovie.genre,
                    summary: updatedMovie.summary,
                    duration: updatedMovie.duration,
                    poster: updatedMovie.poster,
                    cover: updatedMovie.cover
                }
            }
            const result = await database.updateOne(filter, update, options);
            res.send(result);
        })

        app.delete('/allmovies/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await database.deleteOne(query);
            res.send(result);
        })

        app.post('/allmovies', async (req, res) => {
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

