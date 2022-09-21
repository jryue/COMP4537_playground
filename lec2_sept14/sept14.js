// printNameAndAge = () => {
//   console.log(name_, age);
// }

// printNameAndAge();

const { readFile, writeFile } = require("fs");

// const x = readFileSync("./t1.txt");
// const y = readFileSync("./t2.txt");
// writeFileSync("./t3.txt", `this is coming from t1.txt and t2.txt ${x}${y}`);
// console.log(fs);

var xx = "";
var yy = "";

// readFile("./t1.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   xx = data;
//   console.log("1")
//   // read t2.txt
//   readFile("./t2.txt", "utf-8", (err, data) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     yy = data;
//     console.log("2")

//     // write into t3.txt
//     // we want to write AFTER readFile() for t2.txt has finished
//     writeFile("t3.txt", `${xx}${yy}`, () => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       console.log("3")
//     });
//   });

//   // using writeFile() here might write before t2.txt has been read
// });

// console.log("4")


// the order of execution depends on whether it is nested inside
// a callback function
// above example, it will always be 4, 1, 2, 3
// 4 first because the 1,2,3 are called inside callback functions which are
//async

var x = ""
var y = ""

const getText = (fileName) => {
  // order of params matters in promises
  return new Promise( (resolve, reject) => {
    console.log(resolve);

    readFile(fileName, "utf-8", (err, data) => {
      //if there is an error, we can reject the promise
      if (err) {
        reject(err)
      }

      //else no error, resolve promise using the data/payload
      resolve(data)
    })

    // resolve()
    // reject()
  })
}

// getText('./t1.txt')
// .then((data) => {
//   x = data

//   //read t2.txt
//   getText('./t2.txt')
//   .then((data) => {
//     y = data 

//     //write t3.txt here - to ensure order thru callback functions
//     writeFile('./t3.txt', `${x}${y}`, (err) => {
//       if (err) {
//         console.log(err)
//       }
//     })
//   })
  
// }).catch((err) => {
//   console.log(err);
// })

// another way of writing it is

getText('./t1.txt')
.then((data) => {
  x = data 
  return getText('./t2.txt')
})
.catch((err) => {
  console.log(err)
})
.then((data) => {
  y = data 
  writeFile('./t3.txt', `${x}${y}`, (err) => {
      if (err) {
        console.log(err)
      }
    })
})

// using 'await' keywords
// const getText2 = async () => {
//   var xx = "hello"
//   var yy = "world"
//   try {
//     xx = await getText('./t1.txt')
//   }
// }