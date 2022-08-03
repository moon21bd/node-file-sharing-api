"use strict";

const vsprintf = require("sprintf-js").vsprintf; // requiring the sprintf-js
const BAD_REQUEST = require("./app-codes").BAD_REQUEST; // requiring the app-codes to handle bad_request

function AppError(error, options) {
  // function to handle application error. this is to handle the over all application error
  Error.call(this);
  Error.captureStackTrace(this);

  const BAD_REQUEST_CLONE = Object.assign({}, BAD_REQUEST);
  error = Object.assign(BAD_REQUEST_CLONE, error);
  options = options || {};

  this.httpCode = error.httpCode;
  this.code = error.code;
  this.name = error.title;
  this.description = vsprintf(
    options.details || error.details,
    options.args || []
  );
}

AppError.prototype.__proto__ = Error.prototype;

module.exports.AppError = AppError;
