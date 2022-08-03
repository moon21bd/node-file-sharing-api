"use strict";

module.exports = async () => {
  const express = require("express"); // requiring popular node framework express
  const bodyParser = require("body-parser"); // requiring body parser
  const cors = require("cors"); // requiring cors module
  const app = express(); // assigning express function to app const
  require("dotenv").config(); // requiring .env file to get configurable valriable

  // setting up middleware
  app.use(express.json()); // This method is used to parse the incoming requests with JSON payloads
  app.use(express.urlencoded({ extended: false })); // The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false ) or the qs library (when true )

  app.use(bodyParser.json({ limit: "100mb" })); //  parse application/json and here limit: '50mb' consider the error of  "PayloadTooLargeError: request entity too large when trying to POST"
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  // serving static files for upload directory
  app.use(process.env.FOLDER, express.static(process.env.FOLDER));
  // enable CORS
  app.use(cors());

  // registering routes
  const routes = require("./routes/routes")(
    require("./controllers/filesController")(require("./lib/connection"))
  );
  app.use(routes);

  return app;
};
