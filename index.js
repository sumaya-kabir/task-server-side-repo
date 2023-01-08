const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://task:${process.env.DB_PASS}@taskcluster.p95citg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const dataCollection = client.db('skTask').collection('data');

        app.get('/data', async(req, res) => {
            const query = {};
            const data = await dataCollection.find(query).toArray();
            res.send(data);
        });

        app.post('/data', async (req, res) => {
            const data = req.body;
            const result = await dataCollection.insertOne(data);
            res.send(result);
        });

        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await dataCollection.findOne(query);
            res.send(user);
          });

        app.put('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const user = req.body;
            const option = {upsert: true};
            const updateUser = {
              $set: {
                name: user.name,
                sector: user.sector,
              }
            }
            const result = await dataCollection.updateOne(filter, updateUser, option);
            res.send(result);
          });
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req,res) => {
    res.send("Sk task server is running")
})

app.listen(port, () => {
    console.log(`sk task running on the port ${port}`);
})

