// import express
const express = require("express");

//import short id
const shortid = require("shortid");

//create a server
const server = express();
// middleware - to teach express new tricks
server.use(express.json()); // how to parse JSON from the body

//GET request function handler
server.get("/", (req, res) => {
  res.send("hello web 30");
});

//listen for incoming requests
const port = 8000;
server.listen(port, () => console.log(`\n == API on port ${port} == \n`));

let users = [
  {
    id: "1", // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane", // String, required
  },
  {
    id: 2, // hint: use the shortid npm package to generate it
    name: "John Doe", // String, required
    bio: "Not Tarzan's Brother, another John", // String, required
  },
  {
    id: 3, // hint: use the shortid npm package to generate it
    name: "Doe Doe", // String, required
    bio: "Not Tarzan's Cousin, another Doe", // String, required
  },
];

//post function
server.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = shortid.generate();
  // If the request body is missing the `name` or `bio` property:
  if (newUser.name === undefined || newUser.bio === undefined) {
    res.status(400).send("Please provide name and bio for the user.");
  }

  // If the information about the _user_ is valid:
  users.push(newUser);
  res.status(201).send(users);

  // If there's an error while saving the _user_:
  if (!users.hasOwnProperty(newUser)) {
    res
      .status(500)
      .send("There was an error while saving the user to the database");
  }
});

//get function
server.get("/api/users", (req, res) => {
  //If there's an error in retrieving the _users_ from the database
  if (users === undefined) {
    res.status(500).send("The users information could not be retrieved.");
  }

  res.status(200).send(users);
});

//get by id function
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const getUser = users.filter((user) => user.id === id);
  // If the _user_ with the specified `id` is not found:
  if (getUser.length === 0) {
    res.status(404).send("The user information could not be retrieved.");
  } else {
    res.status(200).send(getUser);
  }
  // If there's an error in retrieving the _user_ from the database:
  if (getUser === undefined) {
    res.status(500).send("The user information could not be retrieved.");
  }
});

//delete function
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const getUser = users.filter((user) => user.id === id);
  // If the _user_ with the specified `id` is not found:
  if (getUser.length === 0) {
    res.status(404).send("The user with the specified ID does not exist.");
  } else {
    users = users.filter((user) => user.id !== id);
    res.status(200).send(users);
  }
  // If there's an error in removing the _user_ from the database:
  if (users.hasOwnProperty(getUser)) {
    res.status(500).send("The user could not be removed");
  }
});

//put function
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const getUser = users.filter((user) => user.id === id);
  // If the _user_ with the specified `id` is not found:
  if (getUser.length === undefined) {
    res.status(404).send("The user with the specified ID does not exist.");
  }
  // If the request body is missing the `name` or `bio` property:
  if (req.body.name === undefined || req.body.bio === undefined) {
    res.status(400).send("Please provide name and bio for the user.");
  }
  // If there's an error when updating the _user_:
  if (users.hasOwnProperty(req.body)) {
    res.status(500).send("The user information could not be modified.");
  }
  // If the user is found and the new information is valid:
  const newUser = { id: id, name: req.body.name, bio: req.body.bio };
  let newList = users.map((user) => (user.id !== id ? user : newUser));
  users = newList;
  res.status(200).send(users);
});
