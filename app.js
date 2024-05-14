const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;

const Book = require("./models/Book.model");
const Author = require("./models/Author.model");

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
  Book.find(req.query)
    .then((books) => {
      console.log("Retrieved books ->", books);
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error("Error while retrieving books ->", error);
      res.status(500).json({ error: "Failed to retrieve books" });
    });
});

app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("author")
    .then((book) => {
      console.log("Retrieved book ->", book);
      res.status(200).json(book);
    })
    .catch((error) => {
      console.error("Error while retrieving book ->", error);
      res.status(500).json({ error: "Failed to retrieve book" });
    });
});

app.put("/books/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedBook) => {
      console.log("Book updated ->", updatedBook);
      res.status(204).json(updatedBook);
    })
    .catch((error) => {
      console.error("Error while updating the book ->", error);
      res.status(500).json({ error: "Failed to update the book" });
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

app.delete("/books/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((deletedBook) => {
      console.log("Book deleted ->", deletedBook);
      res.status(204).json(deletedBook);
    })
    .catch((error) => {
      console.error("Error while deleting the book ->", error);
      res.status(500).json({ error: "Failed to delete the book" });
    });
});

app.post("/authors", (req, res) => {
  Author.create(req.body)
    .then((createdAuthor) => {
      console.log("Author created ->", createdAuthor);
      res.status(201).json(createdAuthor);
    })
    .catch((error) => {
      console.error("Error while creating the author ->", error);
      res.status(500).json({ error: "Failed to create the author" });
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
