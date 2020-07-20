// import dependencies
const express = require("express");
const apicache = require("apicache");

//create an express server
const app = express();
const cache = apicache.middleware


// set an initial port
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cache('5 minutes'))


// set up api routes
require("./routes/apiRoutes")(app);

//setup listener
app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
