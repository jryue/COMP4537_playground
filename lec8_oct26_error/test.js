const express = require("express");
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// -------------------- asynchronous (BAD examples that will crash) ------------------

app.get('/a', (req, res) => {
  setTimeout(() => {
    throw new Error('BROKEN')     // This will crash the server
                                  // Express will not catch this on its own.
                                  // Client won't be able to send subsequent requests!
  }, 1000);
  res.send('Hello World');
});

app.get('/b', async (req, res) => {
  let aPromise = new Promise(resolve => {
    throw new Error('Broken')
    setTimeout(resolve, 1000)
  });

  aPromise.then(() => {
    res.send('Hello World');
  })
});

app.get('/c', async (req, res) => {
  await new Promise(resolve => {
    setTimeout(() => {
      throw new Error('Broken')
      resolve()
    }, 1000)
  });
  res.send('Hello World');
});

// app.get("/", (req, res) => {

//   //this is asynchronous code, setImmediate() is an asynchronous function
//   setImmediate(() => {
//     throw new Error("Error thrown");
//   });
//   res.send("Home");
// });


// ------------------------- asynchronous (catches exceptions) -----------------------
app.get('/d', (req, res) => {
  setTimeout(() => {
    try { //try the piece of code that you suspect will cause error
      throw new Error("BROKEN")
      res.send('Hello World')
    } catch (err) {   //catch the error, and send response back
      res.send("Error caught");
    }} , 1000);
});

app.get('/e', (req, res) => {
  let aPromise = new Promise(resolve => { 
    throw new Error('Broken')
    setTimeout(resolve, 1000)
  });

  aPromise.then(() => {
    res.send('Hello World');
  }).catch((err) =>
    res.send('Error'))
});

// expressJS does not handle asynchronous errors by default, so we need to use
// use a try-catch or a Promise to handle asynchronous errors
app.get('/f', async (req, res) => {
  try {
    await new Promise(resolve => {
      throw new Error('Broken')
      setTimeout(resolve, 1000)
    });
    res.send('Hello World');
  } catch {
    res.send('Error');
  }
});

app.get('/g', async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {    // we need try-catch block around the code that might throw an error
        let x = z + 1;
        resolve()
        res.send('Hello World');
      } catch (error) {
        res.send("Error!@#!")
      }
    }, 1000);
  })
});

// -----------------pass error from one middleware to another -----------------------
// ** this get() is a middleware too; add 'next' as a parameter
app.get('/h', async (req, res, next) => {
  setTimeout(() => {
    try {
      let x = z + 1;   //a statement that will cause TypeError
      res.send('Hello World');
    } catch (error) {
      next(error);    //pass error to next middleware
    }
  }, 1000);
})

// when we run the route above, the server will not crash, but the error will be passed to the next middleware

app.get('/i', async (req, res, next) => {
  let aPromise = new Promise(resolve => {
    throw new Error('Broken')
    setTimeout(resolve, 1000)
  });

  aPromise.then(() => {
    res.send('Hello World');
  }).catch((err) =>
    // res.send('Error')
    next(err)
  )
});


app.get('/j', async (req, res, next) => {
  try {
    await new Promise(resolve => {
      throw new Error('Broken')
      setTimeout(resolve, 1000)
    });
    res.send('Hello World');
  } catch (err) {
    // res.send('Error');
    next(err);
  }
});


// ------------------- challenges ------------------------------------------
app.get('/k', async (req, res, next) => {
  try {
    await new Promise(resolve => {
      throw new Error('Broken')
      setTimeout(resolve, 1000)
      res.send('Hello World');
    });
  } catch (err) {
    next(err);  // return next(err) would end this function, so res.send() will not be executed
    res.send("I don't care about the error. I still want to send this response");
  }
});

app.use((err, req, res, next) => {
  res.send("My custom error handler");
})


// error-handling middleware should be defined last
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// PROBLEM 1
/* This is not executed because the custom error handler was defined before the app.get() route. The order of middlewares matters.*/

// PROBLEM 2 - Fix it
app.get('/aa', async (req, res, next) => {
  try {
    await new Promise(resolve => {
      setTimeout(() => {  //Solution: wrap the "throw error" in a try-catch block
        try {
          throw new Error('Broken')
          resolve()
        } catch (error) {
          next(error);
        }
      }, 1000)
    });
    res.send('Hello World');
  } catch (err) {
    console.log("catch");
    next(err)
  }
});

app.use((err, req, res, next) => {
  console.log("my error handler");
  // console.error(err.stack)
  res.status(500).send('Something broke!')
})
