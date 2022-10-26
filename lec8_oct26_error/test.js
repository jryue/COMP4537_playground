// // the 'err' is the Error object (built in error object in JS)
// try {
//   let x = z + 2;
// } catch (err) {
//   console.log(err.name); //prints ReferenceError
//   console.log(err.message); //prints z is not defined
// }

const express = require("express");
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// //express has a built in error handler, which is why this route prints out an error on the route
// //HOWEVER, the built in error handler only triggers for synchronous code
// app.get('/', (req, res) => {
//   let x = z + 1;
//   res.send("Home")
// })

app.get("/", (req, res) => {
  setImmediate(() => {
    throw new Error("Error thrown");
  });
  res.send("Home");
});

app.get("/a", async (req, res) => {
  let x = new Promise((resolve, reject) => {
    setImmediate(() => {
      
      resolve();
    });
    
  });
  x.then(() => {
    res.send("Home");
  })
});

app.get("/anotherRoute", (req, res) => {
  res.send("Another Route");
});
