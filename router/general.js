const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Invalid username or password" });
  if (users.includes(username))
    return res.status(400).json({ message: "Username already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return await res.status(200).json({ ...books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!isbn) return res.status(400).json({ message: "Invalid ISBN" });
  if (!books[isbn]) return res.status(400).json({ message: "Book not found" });
  return await res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const { author } = req.params;
  if (!author) return res.status(400).json({ message: "Invalid author" });
  const booksByAuthor = Object.values(books).filter((book) =>
    book.author.toLowerCase().includes(author.toLowerCase())
  );
  if (!booksByAuthor.length)
    return res.status(400).json({ message: "Author not found" });
  return await res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title",async  function (req, res) {
  //Write your code here
  const { title } = req.params;
  if (!title) return res.status(400).json({ message: "Invalid title" });
  const booksByTitle = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  if (!booksByTitle.length)
    return res.status(400).json({ message: "Title not found" });
  return await res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!isbn) return res.status(400).json({ message: "Invalid ISBN" });
  if (!books[isbn]) return res.status(400).json({ message: "Book not found" });
  if (!books[isbn].reviews)
    return res.status(400).json({ message: "No reviews found" });
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
