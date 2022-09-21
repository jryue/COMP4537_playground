const express = require('express')
const app = express()
const port = 5001


app.listen(port, () => {
  console.log("server is running")

})

//check a request object, and then use send() to pass something back to
//client

// -----------------------------IMPORTANT --------------------------------
//middle-ware -> 'express.static('public')'
//app.use() allows us to use the middleware
app.use(express.static('public'))

// the '/' is the default page
app.get('/', (req, res) => {
  res.send("Getting data!")
})
// on browser go to this route "localhost:5001/profile/23232" to get back 23232
app.get('/profile/:id', (req, res) => {
  const {id} = req.params   //destructuring
  res.send(id)
})

//---------------------------- IMPORTANT ----------------------------------
// the first time we send POST req, it will have server error --> we need to
// use middleware (line 32) to parse
app.use(express.json())
app.post('/profile', (req, res) => {
  //jsonObj = req.body;
  res.json(req.body["userID"])   // --> res.json() to parse the JSON object
})

//for sensitive data such as passwords, better to use .POST() than GET()
// because GET() will expose it on the URL

app.put('/put', (req, res) => {
  res.send("UPDATE")
})

app.delete('/delete', (req, res) => {
  res.send("DELETE")
})

// //sending style.css file in the public folder to browser
// app.get('/style.css', (req, res) => {
//   res.sendFile("./lec3_sept21/public/style.css")
// })

// but with the middleware