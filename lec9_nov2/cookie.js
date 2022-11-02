const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
app.use(cookieParser());

//inspect on CHrome --> APplication --> cookies on left side --> check cookies
//send these 2 cookies to each client
app.get('/', (req, res) => {
  res.cookie('sea', 'blue');
  res.cookie('land', 'green');
  console.log(req.cookies);
  res.send('Hello World');
})

//you can make cookie changes as a client on the Chrome tab (ie. sea: white) and it will show on the terminal
app.get('/a', (req, res) => {
  // res.cookie('sea', 'blue');
  // res.cookie('land', 'green');
  console.log(req.cookies);
  res.send('Hello World');
})

//res.cookie() has a third optional parameter which is an object
//ie. res.cookie('sea', 'blue', {httpOnly: true, maxAge: 6000}); //maxAge is in milliseconds (6 seconds)

//res.clearCookie() to clear a cookie

app.get('/b', (req, res) => {
  res.cookie('sea', 'blue', {maxAge: 6000});
  res.cookie('land', 'green', {httpOnly: true});
  console.log(req.cookies);
  res.send('Hello World');
})

app.get('/login', (req, res) => {
  res.send(`<form action="/login" method="POST">
  <input type="text" name="username" placeholder="username">
  <input type="password" name="password" placeholder="password">
  <button type='submit'>Submit</button>
  </form>`)
});

app.use(express.urlencoded());

app.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.username === 'admin' && req.body.password === '1234') {
    res.cookie('auth', 'true');
    console.log('Login success');
    res.redirect('/admin'); // redirect to admin page
  }
  else {
    res.send('Invalid username or password');
  }
})

app.get('/admin', (req, res) => {
  const { auth } = req.cookies;
  if (auth && auth === 'true') {
    res.send('Welcome to the protected route, logged in user');
  }
  else {
    res.redirect('/login');
  }
})