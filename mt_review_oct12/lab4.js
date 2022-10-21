const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.listen(process.env.PORT || port, async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jryue:pPa04vA3qbDWpfDL@cluster0.bflksa6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    ); //waits for connection to establish
  } catch (error) {
    console.log("db error");
  }
  console.log(`Example app listening on port ${port}`);
});

// Add a schema
const { Schema } = mongoose;

const unicornSchema = new Schema({
  name: String,
  dob: Date,
  loves: [String],
  weight: Number,
  gender: {
    enum: ["f", "m"],
  },
  vampires: Number,
});

//create model
const unicornModel = mongoose.model("unicorns", unicornSchema); // 'unicorns' is name of collection in the DB

// - get all the unicorns
app.get("/api/v2/unicorns", (req, res) => {
  unicornModel
    .find({})
    .then((docs) => {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "db reading error. Check with devs" });
    });
});

// - get a specified unicorn using its unique ID
app.get("/api/v2/unicorn/:id", (req, res) => {
  console.log("does this go thru");
  console.log(req.params.id); //this prints out the id
  //line 52, you have to use this line to check _id
  unicornModel
    .find({ _id: mongoose.Types.ObjectId(`${req.params.id}`) }) //PROBLEM HERE
    .then((doc) => {
      console.log(doc);
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "db reading error... Check with the devs" });
    });
});

// ---------------- NOTE, to use POST() we need THIS line
app.use(express.json());

//create unicorn
app.post("/api/v2/unicorn", (req, res) => {
  unicornModel.create(req.body, function (err) {
    if (err) console.log(err);
  });
  res.json(req.body);
});

// - update a unicorn
app.patch("/api/v2/unicorn/:id", (req, res) => {
  //how does the dereferencing work?
  // its grabbing all the properties from the 'body' EXCEPT _id
  const { _id, ...rest } = req.body; //dereferencing/destructuring
  unicornModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { ...rest } },
    { runValidators: true },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
  res.send("Updated successfully!");
});

// - delete unicorn
app.delete("/api/v2/unicorn/:id", (req, res) => {
  unicornModel.deleteOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );

  res.send("Successfully deleted!");
});

// -------------- CHALLENGES

//update the 'loves' array with requested
app.patch("/api/v2/unicornNewLovesFood/:id/", (req, res) => {
  // //look at the ID and the 'loves' keys; leave the rest as is
  // unicornsJSON = unicornsJSON.map(( { _id, loves, ...rest}) => {

  //   //if the requested objects ID matches in database, return the request objects ID and loves array
  //   if (_id == req.params.id) {
  //     return {_id, loves: req.body.loves, ...rest }
  //   } else {
  //     return { _id, loves, ...rest }
  //   }
  // })

  //deconstruct the request JSON object into variables for each key
  const { _id, loves, ...rest } = req.body;

  //use the 'loves' from the new request object, and update the document's 'loves' array
  // if the _id matches
  unicornModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { loves } },
    { runValidators: true },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
  res.send("Updated successfully!");
});

// add an item to the loves array for specific unicorn
app.patch("/api/v2/unicornAddLovesFood/:id/", (req, res) => {
  const { _id, newLoves } = req.body;

  unicornModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $push: { loves: newLoves } },
    { runValidators: true },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
  res.send("Updated successfully!");
});

// FIX THIS
// remove an item to the loves array for specific unicorn
app.patch("/api/v2/unicornRemoveLovesFood/:id/:item", (req, res) => {
  const { removeFood } = req.params.item; //get the food to be removed from the req.param!!

  unicornModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $pull: { loves: removeFood } }, //$pull will remove any specified value that matches
    function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
  res.send("Gotcha! Food preferences updated");
});

// // ------------------------- editing the data.json file (NOT the database)
// app.patch('/api/v1/unicornNewLovesFood/:id/', (req, res) => {
//   unicornsJSON = unicornsJSON.map(({ _id, loves, ...rest }) => {
//     if (_id == req.params.id) {
//       return { _id, loves: req.body.loves, ...rest }
//     } else
//       return { _id, loves, ...rest }
//   })

//   //update the file
//   writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
//     .then(() => { })
//     .catch((err) => { console.log(err); })

//   res.send("Updated successfully!")
// })

// app.patch('/api/v1/unicornAddLovesFood/:id/', (req, res) => {
//   unicornsJSON = unicornsJSON.map(({ _id, loves, ...rest }) => {
//     if (_id == req.params.id) {
//       return { _id, "loves": [...loves, ...req.body.newLoves], ...rest }
//     } else
//       return { _id, loves, ...rest }
//   })

//   //update the file
//   writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
//     .then(() => { })
//     .catch((err) => { console.log(err); })

//   res.send("Updated successfully!")
// })

// app.patch('/api/v1/unicornRemoveLovesFood/:id/:item', (req, res) => {
//   unicornsJSON = unicornsJSON.map(({ _id, loves, ...rest }) => {
//     if (_id === req.params.id)
//       loves = loves.filter(anItem => anItem !== req.params.item)
//     return { _id, loves, ...rest }
//   })
//   //update the file
//   writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
//     .then(() => { })
//     .catch((err) => { console.log(err); })
//   res.send("Updated successfully!")
// })
