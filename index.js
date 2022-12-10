const express = require("express");
const http = require("http");
const cors = require("cors");
const { initDB } = require("./db");
const ToDo = require("./db/models/ToDo.model");

const app = express();
const PORT = 3000;

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

//Get All ToDos
app.get("/items", async (_, res) => {
  try {
    const todoList = await ToDo.findAll();
    res.status(200).json({ todoList });
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
    res.status(200).json({
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
      res.status(200).json({ todoById });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update existing ToDo element
app.patch("/items/:id", async (req, res) => {
  try {
    const updateUser = await ToDo.findByPk(req.params.id);
    if (updateUser === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      await updateUser.update(
        {
          title: req.body.title,
          description: req.body.description,
          isCompleted: req.body.isCompleted,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const updatedTodo = await ToDo.findByPk(req.params.id);
      res.status(200).json({updatedTodo});
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
    const deletedTodo = await ToDo.findByPk(req.params.id);
    if (deletedTodo === null) {
      res.status(404).json({
        message: "Not Found",
      });
    } else {
      await deletedTodo.destroy();
      res.status(200).json({ message: "ToDo was deleted" });
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
