"use strict";
module.exports = (db) => {
  return require("./filesController")(require("../models/files")(db));
};
