
const https = require('https');
const mongoose = require("mongoose")
const express = require("express")
const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

const { Schema } = mongoose;

var pokeModel = null

const port = 5000

const app = express();

app.listen(port, async () => {
  // 1 - establish the connection the db
  // 2 - create the schema
  // 3 - create the model
  // 4 - populate the db with pokemons
  try {
    await mongoose.connect(
      "mongodb+srv://pokeuser:9u66LDHORlYh68kV@cluster0.bflksa6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.log('db error');
  }

  var possibleTypes = []
  var pokeSchema = null



  // grab the types
  await https.get(url, async (res) => {
    var chunks = "";
    res.on("data", function (chunk) {
      chunks += chunk;
    });
    await res.on("end", async (data) => {
      possibleTypes = JSON.parse(chunks)
      possibleTypes = await possibleTypes.map(element => element.english)
      pokeSchema = new Schema({
        "id": {
          type: Number,
          unique: [true, "You cannot have two pokemons with the same id"]
        },
        "name": {
          "english": {
            type: String,
            required: true,
            maxLength: [20, "Name should be less than 20 characters long"]
          },
          "japanese": String,
          "chinese": String,
          "french": String
        },
        "type": possibleTypes,
        "base": {
          "HP": Number,
          "Attack": Number,
          'Speed Attack': Number,
          'Speed Defense': Number,
          "Speed": Number
        }
      })
      // pokeSchema.index({ "id": 1 }); // schema level
      pokeModel = mongoose.model('pokemons', pokeSchema); // unicorns is the name of the collection in db
    });
  })
  // console.log(possibleTypes);

  // grab the pokemons
  https.get(url, function (res) {
    var chunks = "";
    res.on("data", function (chunk) {
      chunks += chunk;
    });
    res.on("end", function (data) {
      const arr = JSON.parse(chunks);
      arr.map(element => {
        //insert to db
        // console.log(element);
        element["base"]["Speed Attack"] = element["base"]["Sp. Attack"];
        delete element["base"]["Sp. Attack"];
        element["base"]["Speed Defense"] = element["base"]["Sp. Defense"];
        delete element["base"]["Sp. Defense"];
        pokeModel.findOneAndUpdate(element, {}, { upsert: true, new: true }, function (err, result) {
          if (err) console.log(err);
          // saved!
          // console.log(result);
        });
      })
    })
  })
})

app.get("pokemonAdvancedFiltering", async (req, res) => {
  // pass this 'req.query' to the server and use it as input to mongoose's find() method
  // and return a response
  const pokemons = await pokeModel.find(req.query);
  res.send(pokemons)
})