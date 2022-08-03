"use strict";

const SUCCESS = require("../lib/app-codes").SUCCESS;
const INTERNAL_SERVER_ERROR = require("../lib/app-codes").INTERNAL_SERVER_ERROR;
const AppError = require("../lib/app-error").AppError;

function sendSuccessResponse(res) {
  // this func used to send successresponse
  const successResponse = {
    status: SUCCESS.httpCode,
    code: SUCCESS.code,
    title: SUCCESS.title,
    details: SUCCESS.details,
    timestamp: Math.round(Date.now() / 100),
  };

  if (res.data) {
    successResponse.data = !(res.data instanceof Array) ? [res.data] : res.data;
  }

  res.json(successResponse);
}

function sendErrorResponse(err, res) {
  // this func used to send errorresponse
  err = Object.assign(
    {
      httpCode: INTERNAL_SERVER_ERROR.httpCode,
      code: INTERNAL_SERVER_ERROR.code,
      name: INTERNAL_SERVER_ERROR.title,
      description: INTERNAL_SERVER_ERROR.details,
    },
    err
  );

  return res.json({
    status: err.httpCode,
    code: err.code,
    title: err.name,
    details: err.description,
    timestamp: Math.round(Date.now() / 100),
  });
}

module.exports = (err, req, res) => {
  // if any error happend to application this func will do the rest
  if (!res || !res.json || typeof res.json !== "function") {
    throw new AppError(INTERNAL_SERVER_ERROR);
  }

  err ? sendErrorResponse(err, res) : sendSuccessResponse(res);
};
