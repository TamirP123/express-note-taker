const notes = require("express").Router();
const { json } = require("express");
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const { readFile, writeFile } = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

// GET Route for retrieving all the tips
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI tip
notes.post("/", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully`);
  } else {
    res.error("Error in adding note");
  }
});

notes.delete("/:id", (req, res) => {
  console.log(req.params);

  if (req.params) {
    readFile("./db/db.json", "utf-8")
      .then((data) => {
        newData = JSON.parse(data);
        // Loop through the data and remove the matching id
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].id === req.params.id) {
            newData.splice(i, 1);
          }
        }

        const newDb = JSON.stringify(newData);
        return writeFile(`./db/db.json`, newDb);
      })
      .then(() => {
        res.json(`Note deleted successfully`);
      });
  } else {
    res.error("Error in deleting note");
  }
});

module.exports = notes;
