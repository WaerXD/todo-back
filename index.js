const express = require("express");
const http = require("http");
const cors = require("cors");
const { initDB } = require("./db");
const ToDo = require("./db/models/ToDo.model");
const User = require("./db/models/User.model");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logs
app.use((req, res, next) => {
  console.log("URL = ", req.url);
  console.log("Method = ", req.method);
  console.log("HOST = ", req.headers.host);
  console.log("body = ", req.body);
  console.log("query = ", req.query);
  next();
});

//Render Home Page
app.get("/", async (_, res) => {
  const todoList = await ToDo.findAll();
  res.render("home", { todoList });
});

//Render Registation Page
app.get("/register", async (_, res) => {
  res.render("register");
});

//Render Log In page
app.get("/login", async (_, res) => {
  res.render("login");
});

///// Not Yet Employed

//LogIn to existing account
app.get("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find User in DB
  const user = await User.findOne({
    where: {
      username,
      password,
    },
  });

  if (user === null) {
    res.status(404).json({
      message: "User not Found",
    });
  } else {
    // Render user's homepage with Users's ToDo's
  }
  // Sequelize associations needed - ask on lecture
});

// User Registration
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const passwordRepeat = req.body.passwordRepeat;

    // Hash the password here (TBI (Yet to be implemented))
    if (password !== passwordRepeat) {
      res.render("register", { regError: "Passwords Must Match" });
    } else {
      const user = await User.create({
        username: String(req.body.username),
        password: String(req.body.password),
      });
      res.redirect("/");
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get All Users
app.get("/users", async (_, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User By ID
app.delete("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const deletedUser = await User.findByPk(userID);
    if (deletedUser === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      await User.destroy({
        where: {
          id: userID,
        },
      });
      res.status(200).json(deletedUser);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//Delete all Users
app.delete("/users", async (_, res) => {
  try {
    await User.destroy({
      where: {},
    });
    res.status(200).json({
      message: "Deleted all Users",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//////////


//Get All ToDos
app.get("/items", async (_, res) => {
  try {
    const todoList = await ToDo.findAll();
    res.json({ todoList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create New ToDo
app.post("/items", async (req, res) => {
  try {
    const todo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted,
    });
    res.redirect("/");
    res.json({
      todo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ToDo by ID
app.get("/items/:id", async (req, res) => {
  try {
    const todoById = await ToDo.findByPk(req.params.id);
    if (todoById === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      res.json(todoById);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update existing ToDo element
app.patch("/items/:id", async (req, res) => {
  try {
    const updateID = await ToDo.findByPk(req.params.id);

    if (updateID === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      await updateID.update(
        {
          title: req.body.title,
          description: req.body.description,
          isCompleted: req.body.isCompleted,
        },
      );
      res.status(200).json(await ToDo.findByPk(req.params.id));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete all ToDo elements
app.delete("/items", async (_, res) => {
  try {
    await ToDo.destroy({
      where: {},
    });
    res.status(200).json({
      message: "deleted all ToDo's",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//Delete ToDo element by ID
app.delete("/items/:id", async (req, res) => {
  try {
    const deletedElement = await ToDo.findByPk(req.params.id);
    if (deletedElement === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      res.status(200).json(deletedElement);
      await deletedElement.destroy();
    }
  } catch (error) {
      res.status(500).json({
      error: error.message,
    });
  }
});

//Start server
http.createServer(app).listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

//Initialize DB
initDB();
