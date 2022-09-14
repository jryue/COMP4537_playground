// printNameAndAge = () => {
//   console.log(name_, age);
// }

// printNameAndAge();


const {readFileSync, writeFileSync} = require('fs')

const x = readFileSync('./t1.txt')
const y = readFileSync('./t2.txt')
writeFileSync("./t3.txt", `this is coming from t1.txt and t2.txt ${x}${y}`)
console.log(fs);