const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;

const Book = require("./models/Book.model");

const app = express();

console.log(PORT);

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/mongoose-intro-dev")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      console.log("Retrieved books ->", books);
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error("Error while retrieving books ->", error);
      res.status(500).json({ error: "Failed to retrieve books" });
    });
});

app.post("/books", (req, res) => {
  Book.create(req.body)
    .then((createdBook) => {
      console.log("Book created ->", createdBook);
      res.status(201).json(createdBook);
    })
    .catch((error) => {
      console.error("Error while creating the book ->", error);
      res.status(500).json({ error: "Failed to create the book" });
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
