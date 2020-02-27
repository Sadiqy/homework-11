
// need express to interact with the front end
const express = require("express");
// need path for filename paths
const path = require("path");
// need fs to read and write to files
const fs = require("fs");

// creating an "express" server
const app = express();
// Sets an Initial port for listeners
const PORT = process.env.PORT || 9001;

//  Initialize notesData

let notesData = [];

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

// routes


app.get("/api/notes", function(err, res) {
  try {
    // reads the notes from json file
    notesData = fs.readFileSync("Develop/db/db.json", "utf8");
    console.log("hello!");
    
    notesData = JSON.parse(notesData);

  } catch (err) {
    console.log("\n error (in app.get.catch):");
    console.log(err);
  }
  res.json(notesData);
});

app.post("/api/notes", function(req, res) {
  try {
    // reads the json file
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    console.log(notesData);

    notesData = JSON.parse(notesData);
    // Set new notes id
    req.body.id = notesData.length;
    notesData.push(req.body); // req.body - user input
    // make it string(stringify)so you can write it to the file
    notesData = JSON.stringify(notesData);
    // writes the new note to file
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });
    // changeit back to an array of objects & send it back to the browser(client)
    res.json(JSON.parse(notesData));

    // error Handling
  } catch (err) {
    throw err;
    console.error(err);
  }
});

// Delete a note

app.delete("/api/notes/:id", function(req, res) {
  try {
    //  reads the json file
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    // parse the data to get an array of the objects
    notesData = JSON.parse(notesData);
    // delete the old note from the array on note objects
    notesData = notesData.filter(function(note) {
      return note.id != req.params.id;
    });
    // make it string(stringify)so you can write it to the file
    notesData = JSON.stringify(notesData);
    // write the new notes to the file
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.send(JSON.parse(notesData));

    // error handling
  } catch (err) {
    throw err;
    console.log(err);
  }
});


app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});


app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/api/notes", function(req, res) {
  return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});


app.listen(PORT, function() {
  console.log("SERVER IS LISTENING: " + PORT);
});