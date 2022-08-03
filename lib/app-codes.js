"use strict";

const httpCodes = require("./http-codes"); // requiring http-codes

module.exports = {
  // this will be the response message to follow
  SUCCESS: {
    httpCode: httpCodes.OK.code,
    code: 0,
    title: "Success",
    details: "Success",
  },
  ERROR: {
    httpCode: httpCodes.INTERNAL_SERVER_ERROR.code,
    code: 0,
    title: "Failed",
    details: "Failed",
  },
  NOT_FOUND: {
    httpCode: httpCodes.NOT_FOUND.code,
    code: 253,
    title: httpCodes.NOT_FOUND.msg,
    details: httpCodes.NOT_FOUND.msg,
  },
  BAD_REQUEST: {
    httpCode: httpCodes.BAD_REQUEST.code,
    code: 254,
    title: httpCodes.BAD_REQUEST.msg,
    details: httpCodes.BAD_REQUEST.msg,
  },
  INTERNAL_SERVER_ERROR: {
    httpCode: httpCodes.INTERNAL_SERVER_ERROR.code,
    code: 255,
    title: httpCodes.INTERNAL_SERVER_ERROR.msg,
    details: httpCodes.INTERNAL_SERVER_ERROR.msg,
  },
};
