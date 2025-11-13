const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.USER_PASS}@datahive.5frjob8.mongodb.net/?appName=DataHive`;

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
    const favCollection = database.collection("favorites");
    const sliderCollection = database.collection("slider_db");
    const menuCollection = database.collection("menu");
    const jobCollection = database.collection("jobs");
    const offerCollection = database.collection("offer");

    // get
    app.get("/reviews", async (req, res) => {
      const id = req.query.id;
      const query = {};
      if (id) {
        query._id = id;
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get my review

    app.get("/myreviews", async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    // show-6 review

    app.get("/latest-reviews", async (req, res) => {
      const cursor = reviewCollection.find().sort({ review_date: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // sigle get
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });

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
          food_name: updatedReviews.food_name,
          restaurant_name: updatedReviews.restaurant_name,
          rating: updatedReviews.rating,
          price: updatedReviews.price,
          review_text: updatedReviews.review_text,
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
    // search
    app.get("/reviews", async (req, res) => {
      const { search } = req.query;
      const query = search
        ? { food_name: { $regex: search, $options: "i" } }
        : {};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    //  favorites realted APIs

    // get
    app.get("/favorites", async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = {};
      if (userEmail) {
        query.userEmail = userEmail;
      }
      const cursor = favCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // single get

    app.get("/favorites/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favCollection.findOne(query);
      res.send(result);
    });

    // post
    app.post("/favorites", async (req, res) => {
      const newFavorite = req.body;
      const result = await favCollection.insertOne(newFavorite);
      res.send(result);
    });

    // Update

    app.patch("/favorites/:id", async (req, res) => {
      const id = req.params.id;
      const updateFavorite = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          food_name: updateFavorite.food_name,
          restaurant_name: updateFavorite.restaurant_name,
          rating: updateFavorite.rating,
          price: updateFavorite.price,
          review_text: updateFavorite.review_text,
        },
      };
      const result = await favCollection.updateOne(query, update);
      res.send(result);
    });

    // delete
    app.delete("/favorites/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favCollection.deleteOne(query);
      res.send(result);
    });

    // slider
    app.get("/sliderCollection", async (req, res) => {
      const cursor = sliderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Menu
    app.get("/menu", async (req, res) => {
      const cursor = menuCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // jobCollection
    app.get("/jobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // offerCollection

    app.get("/offers", async (req, res) => {
      const cursor = offerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Listen
app.listen(port, () => {
  console.log(`DishDive server is running port: ${port}`);
});
