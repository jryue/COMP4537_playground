const {send} = require('process')
const express = require('express')
const app = express();
const morgan = require('morgan')

app.listen(5000)

const fn = () => {
  console.log('Time:', Date.now())
}

//this is a function too:  " (req, res) => { console.log('fn1')}"
//there is another optional param called 'next'
const fn1 = (req, res, next) => {
  console.log('fn1')
  next()
  // if (!x) {
  //   res.send("The end!")
  // } else {
  //   next(); //passes control to the next function
  // }
  
}

const fn2 = (req, res, next) => {
  console.log('fn2')
  next()
}

// **** makes a difference where you put the middle-ware function
//applied for the routes that are AFTER the middle-ware
// app.use(() => {
//   console.log('Time:', Date.now())
// })

// can we specify a middleware to this route?? - YES
app.get('/users', fn1, (req, res) => {
  res.send("users")
})

app.use(fn)
app.use(fn1)
app.use(fn2)

app.get('/', (req, res) => {
  res.send("Home page!")
})


app.get('/anotherRoute', (req, res) => {
  res.send("anotherRoute")
})


// ***********************  another middleware 'morgan' 
// note: have to install
