const express = require('express')
const app = express()
const port = 5001


app.listen(port, () => {
  console.log("server is running")


})

//check a request object, and then use send() to pass something back to
//client

// the '/' is the default page
app.get('/', (req, res) => {
  res.send("Home page!")
})

app.post('/post', (req, res) => {
  res.send("POST NEW DATA!")
})
app.put('/put', (req, res) => {
  res.send("UPDATE")
})
app.delete('/delete', (req, res) => {
  res.send("DELETE")
})