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

readFile("./t1.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  xx = data;
  console.log("1")
  // read t2.txt
  readFile("./t2.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    yy = data;
    console.log("2")

    // write into t3.txt
    // we want to write AFTER readFile() for t2.txt has finished
    writeFile("t3.txt", `${xx}${yy}`, () => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("3")
    });
  });

  // using writeFile() here might write before t2.txt has been read
});

console.log("4")


// the order of execution depends on whether it is nested inside
// a callback function
// above example, it will always be 4, 1, 2, 3
// 4 first because the 1,2,3 are called inside callback functions which are
//async

