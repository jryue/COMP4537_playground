const https = require("https");

app.listen(5000, () => {
  console.log(
    https.get("URL goes here", (req, res) => {
      var chunks = "";
      res.on("data", (chunk) => {
        console.log(chunk);
        chunks += chunk;
      });
      res.on("end", () => {
        chunksJSON = JSON.parse(chunks); //parse into JSON object
        console.log(JSON.parse(chunks));
        console.log(chunksJSON[0]); //get only first element of JSON array
      })
    })
  );
});
