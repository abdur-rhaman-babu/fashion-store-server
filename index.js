require('dotenv').config()
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6avkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const fashionCollection = client.db("fashionDB").collection("fashions");

    // create Fashion
    app.post("/fashions", async (req, res) => {
        const newFashion = req.body;
        const result = await fashionCollection.insertOne(newFashion)
        res.send(result)
    });

    // Read Fashion
    app.get('/fashions', async (req, res)=>{
        const cursor = fashionCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // delete fashion
    app.delete('/fashions/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await fashionCollection.deleteOne(query)
        res.send(result)
    })

    // Get data for Update
    app.get('/fashions/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await fashionCollection.findOne(query)
        res.send(result)
    })

    app.put('/fashions/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const fashion = req.body;
        const  updatedFashion = {
            $set:{
                name: fashion.name,
                price: fashion.price,
                details: fashion.details,
                photo: fashion.photo
            }
        }
        const result = await fashionCollection.updateOne(query, updatedFashion, options)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fashion Server is running.......");
});

app.listen(port, () => {
  console.log(`Fashion Server is Running on port ${port}`);
});
