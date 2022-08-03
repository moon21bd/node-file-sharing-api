"use strict";

module.exports = (filesController) => {
  const express = require("express"); // requiring express module
  const router = express.Router(); // initializing express router
  const responseHandler = require("../utils/response-handler"); // requiring custom response-handler module
  const filesUploadMiddleware = require("../lib/upload-config"); // requiring custom file upload middleware
  const AppError = require("../lib/app-error").AppError; // requiring app-error
  const appCodes = require("../lib/app-codes"); // requiring app-codes

  router
    .post(
      "/files",
      filesUploadMiddleware, // sending files upload middleware
      async (req, res, next) => {
        req.body = req.files; // sending files requests as body params
        next(); // after done working, this middleware will pass to next() to handle further tasks
      },
      async function (req, res) {
        try {
          res.data = await filesController.insert(req.body); // trying to insert files to Db
          responseHandler(null, req, res); // send response to response handler
        } catch (err) {
          responseHandler(err, req, res); // send error response to api
        }
      }
    )
    .get(
      "/files/:publicKey",
      function (req, res, next) {
        req.body = req.params; // sending params requests as body params
        next(); // after done working, this middleware will pass to next() to handle further tasks
      },
      async function (req, res, next) {
        const publicKey = req.body.publicKey; // this is the public key from  request body params

        const fetchFile = await filesController.getFilesByPublicKey(publicKey); // trying to get files
        // console.log(fetchFile);
        if (fetchFile) {
          // we're good to get the file

          await filesController.updateFileStatus(publicKey); // update download status
          res.sendFile(process.env.FOLDER + "/" + fetchFile, { root: "." }); // sending the file to  return a response stream with a MIME type representing the actual file format.
        } else {
          responseHandler(new AppError(appCodes.ERROR), req, res); // send response to response handler
        }
      }
    )
    .delete(
      "/files/:privateKey",
      function (req, res, next) {
        req.body = req.params; // sending params requests as body params
        next(); // after done working, this middleware will pass to next() to handle further tasks
      },
      async function (req, res, next) {
        // console.log("req", req.body.privateKey);
        const privateKey = req.body.privateKey; // this is the public key from  request body params

        const checkBeforeDelete = await filesController.checkBeforeDelete(
          privateKey
        ); // checking delete compatability

        if (checkBeforeDelete) {
          // we're good to proceed from here
          const deleteFile = await filesController.deleteFilesFromDb(
            privateKey
          ); // calling the Db files
          await filesController
            .deleteFilesFromDb(privateKey)
            .then(async function (input) {
              if (input === null) {
                // handling input null values
                return false;
              } else {
                res.data = {
                  msg: "Successfully deleted",
                }; // if successfully deleted then this object containg success message will fly
                responseHandler(null, req, res); // send response to response handler
              }
            })
            .catch((err) => {
              console.log("I'm from Bangladesh");
              responseHandler(new AppError(appCodes.ERROR), req, res); // send response to response handler
            });
        } else {
          // failed here
          responseHandler(new AppError(appCodes.ERROR), req, res); // send response to response handler
        }
      }
    );

  return router; // finally returing the router
};
