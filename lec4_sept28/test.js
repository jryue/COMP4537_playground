// Notes: start up the mongodb database on ubuntu first

const mongoose = require('mongoose')

async function main() {
  //connect using a connection string
  await mongoose.connect('mongodb://localhost:27017/test')

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

main().catch(err => console.log(err));

// logic goes here

//import mongoose from 'mongoose';
const {Schema} = mongoose;

// the schema is just the type of data that we are storing in the collection
const unicornSchema = new Schema({
  name: String,
  weight: {type: Number},
  loves: [String],
  // gender: {
  //   type: { enum: ['m', 'f']},
  //   required: true
  // }
});

//we are creating a collection called 'unicorns' using the defined schema
const unicornModel = mongoose.model('unicorns', unicornSchema); 

//const aUnicornModel = new unicornModel();

//create(), find(), updateMany(), updateOne()

// const aUnicornModel = new unicornModel( { name: 'test'});
// aUnicornModel.save(function (err) {
//   if (err) {console.log(err)};
// })

// -------------- Create a document and add to collection
// unicornModel.create( {name: 'test2' }, function (err, notsure) {
//   if (err) console.log(err);

//   console.log(notsure);
// })

// ---------------- Create multiple documents at once
// unicornModel.insertMany([ { name: 'test3'}, { name: 'test4'}], function(err) {
//   if (err) console.log(err);
// })

// each document is an INSTANCE of a model

// --------------------- UPDATE NOTE
//behavior of update() in mongoose and mongodb are DIFFERENT

// delete ONE document that matches criteria
unicornModel.deleteOne({ name: 'test4'}, function(err, bh) {
  if (err) console.log(err);

  console.log(bh);
})

