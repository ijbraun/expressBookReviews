const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const exists = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!exists(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    
    return res.send(JSON.stringify(books));
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn",  (req, res) => {
    let foundbook = books[req.params.isbn]
    return res.send(JSON.stringify(foundbook));
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    let filteredByAuthor = [];
    for (const key in books) {
        if (Object.prototype.hasOwnProperty.call(books, key)) {
            const element = books[key];           
            if (element.author === author) {
                filteredByAuthor.push(element);
            }
        }
    }
    return res.send(JSON.stringify(filteredByAuthor));
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title;
    let filteredByTitle = [];
    for (const key in books) {
        if (Object.prototype.hasOwnProperty.call(books, key)) {
            const element = books[key];           
            if (element.title === title) {
                filteredByTitle.push(element);
            }
        }
    }
    return res.send(JSON.stringify(filteredByTitle));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
