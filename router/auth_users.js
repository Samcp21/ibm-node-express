const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const findUser = users.find((user) => user.username === username);
  return findUser ? true : false;
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find((user) => user.username === username);
  if (!user) return false;
  return user.password === password;

  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Invalid username or password" });
  if (!isValid(username))
    return res.status(400).json({ message: "Invalid username" });
  if (!authenticatedUser(username, password))
    return res.status(400).json({ message: "Invalid password" });
  const token = jwt.sign({ username }, "fingerprint_customer");
  return res.status(200).json({ token });

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review, username } = req.body;

  if (!isbn || !review)
    return res.status(400).json({ message: "Invalid ISBN or review" });
  if (!books[isbn]) return res.status(400).json({ message: "Book not found" });
  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review, username } = req.body;

  if (!isbn || !review)
    return res.status(400).json({ message: "Invalid ISBN or review" });
  if (!books[isbn]) return res.status(400).json({ message: "Book not found" });
  if (!books[isbn].reviews) books[isbn].reviews = {};

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
