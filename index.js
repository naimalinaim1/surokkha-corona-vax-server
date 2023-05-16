const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.URI;

// middleware
app.use(cors());
app.use(express.json());

// router
app.get("/", (req, res) => {
  res.send("Surokkha server is running");
});

// mongodb
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });

    const database = client.db("surokkha").collection("users");
    const adminCollection = client.db("surokkha").collection("admin");

    app.post("/admin", async (req, res) => {
      const email = req.query?.email;
      const password = req.query?.password;
      const query = { email, password };
      const options = {
        projection: { _id: 1 },
      };
      const result = await adminCollection.findOne(query, options);
      res.send(result || {});
    });

    // get all user or only nid, birth and passport user
    app.get("/users", async (req, res) => {
      const registerType = req.query?.type;
      let query = {};
      if (registerType) {
        query = { registerType };
      }
      const result = await database.find(query).toArray();
      res.send(result);
    });

    // get a user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await database.findOne(filter);
      res.send(result);
    });

    // add a new user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const type = req.body.registerType;
      let query = {};
      if (type === "nid") {
        query = { nidNumber: req.body.nidNumber };
      } else if (type === "birth") {
        query = { birthNumber: req.body.birthNumber };
      } else if (type === "passport") {
        query = { passportNumber: req.body.passportNumber };
      }

      const find = await database.findOne(query);
      if (find?._id) {
        res.send({ message: "You are already register", alReady: true });
        return;
      }
      const result = await database.insertOne(newUser);
      res.send(result);
    });

    // update a user
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateUserInfo = req.body;
      delete updateUserInfo._id;
      const filter = { _id: new ObjectId(id) };

      const updateUser = {
        $set: {
          ...updateUserInfo,
        },
      };

      const result = await database.updateOne(filter, updateUser);
      res.send(result);
    });

    // delete a user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await database.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
