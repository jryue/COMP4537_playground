// the server.js part

const mongoose = require("mongoose");
const express = require("express");
const { connectDB } = require("./connectDB.js");
const { populatePokemons } = require("./populatePokemons.js");
const { getTypes } = require("./getTypes.js");
const { handleErr } = require("./errorHandler.js");
const app = express();
const port = 5004;
var pokeModel = null;

const start = async () => {
  // console.log("starting the server");
  await connectDB();
  const pokeSchema = await getTypes();
  pokeModel = await populatePokemons(pokeSchema);

  app.listen(port, (err) => {
    // console.log("app.listen started");
    if (err) console.log(err);
    else console.log(`Phew! Server is running on port: ${port}`);
  });
};
start();

app.get("/api/v1/pokemons", async (req, res) => {
  console.log("GET /api/v1/pokemons");
  if (!req.query["count"]) req.query["count"] = 10;
  if (!req.query["after"]) req.query["after"] = 0;
  try {
    const docs = await pokeModel
      .find({})
      .sort({ id: 1 })
      .skip(req.query["after"])
      .limit(req.query["count"]);
    res.json(docs);
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.get("/api/v1/pokemon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docs = await pokeModel.find({ id: id });
    if (docs.length != 0) res.json(docs);
    else res.json({ errMsg: "Pokemon not found" });
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.use(express.json());

app.post("/api/v1/pokemon/", async (req, res) => {
  try {
    const pokeDoc = await pokeModel.create(req.body);
    // console.log(pokeDoc);
    res.json({
      msg: "Added Successfully",
    });
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.delete("/api/v1/pokemon/:id", async (req, res) => {
  try {
    const docs = await pokeModel.findOneAndRemove({ id: req.params.id });
    if (docs)
      res.json({
        msg: "Deleted Successfully",
      });
    else
      res.json({
        errMsg: "Pokemon not found",
      });
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.put("/api/v1/pokemon/:id", async (req, res) => {
  try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    // console.log(docs);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      res.json({
        msg: "Not found",
      });
    }
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.patch("/api/v1/pokemon/:id", async (req, res) => {
  try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      res.json({
        msg: "Not found",
      });
    }
  } catch (err) {
    res.json(handleErr(err));
  }
});

app.get("/api/v1/pokemonsAdvancedFiltering1", async (req, res) => {
  try {
    const pokemons = await pokeModel.find(req.query);
    res.json(pokemons[0]);
  } catch (err) {
    res.send({ msg: "No pokemon matches that filter" });
  }
});

//have to form another route in case of improper queries
app.get("/api/v1/pokemonsAdvancedFiltering2", async (req, res) => {
  try {
    const {
      id,
      "base.HP": baseHP,
      "base.Attack": baseAttack,
      "base.Defense": baseDefense,
      "base.Speed": baseSpeed,
      "base.Speed Attack": baseSpAttack,
      "base.Speed Defense": baseSpDefense,
      "name.english": nameEnglish,
      "name.japanese": nameJapanese,
      "name.chinese": nameChinese,
      "name.french": nameFrench,
      type,
      page,
      sort,
      filteredProperty,
      hitsPerPage,
    } = req.query;

    const query = {};

    //passing single ID
    //if (id) query.id = Number(id)

    //if id is given multiple values split with commas
    if (id) query.id = { $in: id.split(",").map((element) => element.trim()) };
    console.log(query.id);

    if (baseHP) query["base.HP"] = baseHP;
    if (baseAttack) query["base.Attack"] = baseAttack;
    if (baseDefense) query["base.Defense"] = baseDefense;
    if (baseSpAttack) query["base.Speed Attack"] = baseSpAttack;
    if (baseSpDefense) query["base.Speed Defense"] = baseSpDefense;
    if (baseSpeed) query["base.Speed"] = baseSpeed;

    if (nameEnglish) query["name.english"] = nameEnglish;
    if (nameJapanese) query["name.japanese"] = nameJapanese;
    if (nameChinese) query["name.chinese"] = nameChinese;
    if (nameFrench) query["name.french"] = nameFrench;

    if (page) query.page = page;
    if (sort) query.sort = sort;
    if (filteredProperty) query.filteredProperty = filteredProperty;
    if (hitsPerPage) query.hitsPerPage = hitsPerPage;

    // getting rid of the spaces and comma from the type queries
    if (type)
      query.type = { $in: type.split(",").map((element) => element.trim()) };

    const mongooseQuery = pokeModel.find(query);
    if (sort) mongooseQuery.sort(sort);

    const pokemons = await mongooseQuery;

    res.send({ hits: pokemons, key: "asdas" });
  } catch (err) {
    res.send({ msg: "No pokemon matches filter" });
  }
});

//return all the pokemons that has HP less than or equal to 20 and Attack more than 30
app.get("/api/v1/pokemonsAdvancedFiltering3", async (req, res) => {
  try {
    const { comparisonOperators } = req.query;
    let query = {}; //our query
    let queryInput = "";
    let doc = {}; //building the document to be inserted into the query

    if (comparisonOperators) {
      query.comparisonOperators = {
        //separate into each element by the comma, then trim whitespace, then
        //replace the operators with mongoose operators
        $in: comparisonOperators
          .split(",")
          .map((item) =>
            item
              .trim()
              .replace(/==/g, " $eq ")
              .replace(/!=/g, " $ne ")
              .replace(/>=/g, " $gte ")
              .replace(/<=/g, " $lte ")
              .replace(/>/g, " $gt ")
              .replace(/</g, " $lt ")
          ),
      };
      //split the query into an array of strings and join them with a space
      query.comparisonOperators.$in = query.comparisonOperators.$in.map(
        (item) => {
          let [stat, mongooseOperator, value] = item.split(" ");
          //edit stat to match the schema
          stat = "base." + stat;
          //rebuild query.comparisonOperators into this format: ie. {base.HP: {$gte: 20}}
          return { [stat]: { [mongooseOperator]: value } };
        }
      );
    }

    console.log(query.comparisonOperators.$in);
    doc = await pokeModel.find({ $and: query.comparisonOperators.$in });
    res.json(doc);
  } catch (err) {
    console.log(err);
  }
});

app.get("*", (req, res) => {
  res.json({
    msg: "Improper route. Check API docs plz.",
  });
});
