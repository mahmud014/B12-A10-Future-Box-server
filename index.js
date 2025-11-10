const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://DishDive_DB:CFFZFTLXn6pJ0I4n@datahive.5frjob8.mongodb.net/?appName=DataHive";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Normal get
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Function
async function run() {
  try {
    await client.connect();

    const database = client.db("DishDive_DB");
    const reviewCollection = database.collection("reviews");

    // post
    app.post("/reviews", async (req, res) => {
      const newReviews = req.body;
      const result = await reviewCollection.insertOne(newReviews);
      res.send(result);
    });

    // Update
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const updatedReviews = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedReviews.name,
          price: updatedReviews,
          price,
        },
      };
      const result = await reviewCollection.updateOne(query, update);
      res.send(result);
    });

    // Delete
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// Listen
app.listen(port, () => {
  console.log(`DishDive server is running port: ${port}`);
});
