"use strict";

const multer = require("multer"); // requiring multer for uploading files
const path = require("path"); // requiring path module of nodejs
require("dotenv").config(); // requiring .env file to get configurable valriable

// handle storage using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.FOLDER); // setting up destination folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // generating filename
  },
});

// init/setting up multer upload
// handle multiple files upload process and define filetype
const uploadFiles = multer({
  storage,
}).array("filename");
module.exports = uploadFiles;
