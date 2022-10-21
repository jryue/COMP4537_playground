const express = require("express");

//imports from the 'fs' module for read/write to file
const util = require("util");
const { writeFile, readFile } = require("fs");
const writeFileAsync = util.promisify(writeFile);
const readFileAsync = util.promisify(readFile);

//var { unicornsJSON } = require('./data.js')
var unicornsJSON = [];

const app = express();
const port = 5000;

// make this asynchronous because we need to wait to read the file
app.listen(process.env.PORT || port, async () => {
  try {
    //similar to establishing connection to a database
    //here, server waits until database connects and reads the database contents
    unicornsJSON = await readFileAsync("./unicorndata.json", "utf-8");
    if (!unicornsJSON) {
      console.log("Sorry, could not read the file! Boo");
      return;
    }
    console.log("Awesome!!");
    unicornsJSON = JSON.parse(unicornsJSON);
    console.log(unicornsJSON);
  } catch (err) {
    console.log(err);
  }
  //once database is ready, server connects
  console.log(`lab3 server listening in on port: ${port}`);
});

// - get all the unicorns
app.get("/api/v1/unicorns", (req, res) => {
  res.json(unicornsJSON);
  console.log("reading all da unicorns :D ")
  console.log(unicornsJSON);
});

// - get a specific unicorn
app.get("/api/v1/unicorn/:id", (req, res) => {
  var found = false;

  //iterating over all unicorn objects in JSON
  for (i = 0; i < unicornsJSON.length; i++) {
    //check if that unicorn ID matches the one we are looking for
    if (unicornsJSON[i]._id == req.params.id) {
      found = true;
      break;
    }
  }

  //if found, return that unicorn element from the JSON object array
  if (found) {
    res.json(unicornsJSON[i]);
    return;
  }
  res.json({ msg: "not found" });
});

// - create a new unicorn (POST method)
// *** line 42 -> we need this whenever we need a JSON from a HTTP POST request
app.use(express.json());
app.post("/api/v1/unicorn", (req, res) => {
  //pushing the 'req' which is whatever the client is passing to me/server
  unicornsJSON.push(req.body);
  //we log this to see if it added to the unicornsJSON array
  console.log(unicornsJSON);
  res.send("Created a new unicorn!");

  //HOWEVER, when we add a new unicorn, we want to also fix the data.js
  //update the file
  writeFileAsync("./data.json", JSON.stringify(unicornsJSON), "utf-8")
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
  res.json(req.body);
});

// - UPDATE a unicorn
app.patch("/api/v1/unicorn/:id", (req, res) => {
  //map() function  is called for every element of array
  //the '...' is a spread syntax
  unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
    if (_id == req.body._id) {
      //console.log("BRUh", unicornsJSON);
      return req.body;
    } else {
      return aUnicorn;
    }
  });
  //console.log("BRUh", unicornsJSON);
  //updated unicorn, so have to edit the 'data.json' file
  writeFileAsync("./data.json", JSON.stringify(unicornsJSON), "utf-8")
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
  res.send("Nice, we updated that unicorn!");
});

// - delete unicorn
app.delete("/api/v1/unicorn/:id", (req, res) => {
  //use 'filter' function to filter elements based on a condition
  //ie. the original array will be the same array except for the element whose ID matched
  // the req ID
  unicornsJSON = unicornsJSON.filter((element) => element._id != req.params.id);

  //deleted a unicorn, so edit the 'data.json' file
  writeFileAsync("./data.json", JSON.stringify(unicornsJSON), "utf-8")
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
  console.log(unicornsJSON);
  res.send("Deleted successfully!");
});
