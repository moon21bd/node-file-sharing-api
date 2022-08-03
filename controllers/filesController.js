"use strict";

module.exports = (db) => {
  const AppError = require("../lib/app-error").AppError; // requiring app-error
  const appCodes = require("../lib/app-codes"); // requiring app-codes
  const { uuid, now, uniqueKeyGenerator } = require("../lib/helpers"); // requiring helpers function that commonly use for service

  return {
    async insert(files) {
      // initializing insert func
      const pf = await this.processFiles(files); // calling process file
      return await pf.map(function (i) {
        return {
          privateKey: i.privateKey,
          publicKey: i.publicKey,
        };
      }, pf); // customizing api response for
    },
    async processFiles(files) {
      // processing the files array to db
      let newFiles = files.map(function (i) {
        // mapping through files array and seting up for multiple file insert
        return {
          uuid: uuid(),
          filename: i.filename,
          privateKey: uniqueKeyGenerator(),
          publicKey: uniqueKeyGenerator(),
          status: 0,
          created_at: now(),
          updated_at: now(),
        };
      }, files);

      await this.insertFilesIntoDb(newFiles); // modified file will be insert to db by calling this func
      return newFiles; // returning processed response to rest api
    },
    // Function to insert multiple Row in database
    async insertFilesIntoDb(data) {
      // Query to insert multiple rows
      let query = `INSERT INTO files 
        (uuid, filename, private_key, public_key, status, created_at, updated_at) VALUES ?;`;

      // Organizing values to be inserted. here data array will be map through and then this will be generate an modified array to insert to db
      let newData = data.map((item) => {
        return [
          uuid(),
          item.filename,
          uniqueKeyGenerator(),
          uniqueKeyGenerator(),
          0,
          now(),
          now(),
        ];
      });

      // Executing the query with following data
      db.query(query, [newData], (err, results, fields) => {
        if (err) throw new AppError(appCodes.ERROR); // throw err if any error occured
        return results; // returning the db success result
      });

      return true;
    },
    async checkBeforeDelete(privateKey) {
      // this method will be called if delete api call. we will check data before deleting it.
      return await this.checkIsFileExists(privateKey)
        .then(async function (input) {
          if (input === null) {
            // if input getting null then we will return false from here
            return false;
          } else {
            // we're ok with this block
            return input; // just returning input values
          }
        })
        .catch((err) => {
          return new AppError(appCodes.ERROR); // this is the error refer to Db error
        }); // calling db method to check the data existancy in db
    },
    async getFilesByPublicKey(data) {
      // checking and expecting to getting data from db by publicKey
      return await this.getFilesFromDb(data)
        .then(async function (input) {
          if (input === null) {
            // if input getting null then we will return false from here
            return false;
          } else {
            // we're ok with this block
            // console.log("input", input);
            return input;
          }
        })
        .catch((err) => {
          return new AppError(appCodes.ERROR);
        }); // func calling to getting data from db by publickey
    },
    async getFilesFromDb(publicKey) {
      return new Promise((resolve, reject) => {
        // introducing promise based calling
        // Executing the query
        db.query(
          "SELECT `filename` FROM `files` WHERE `public_key`= ?",
          [publicKey],
          function (err, results) {
            if (err) throw reject(new AppError(appCodes.ERROR)); // throw err
            // console.log(results);
            if (typeof results !== "undefined" && results.length === 0) {
              // handling data not found situation
              resolve(null);
            } else {
              resolve(results[0].filename); // resolving filename from Db
            }
          }
        );
      });
    },
    async checkIsFileExists(privateKey) {
      // func for checking file existancy
      return new Promise((resolve, reject) => {
        // Executing the query
        db.query(
          "SELECT `filename` FROM `files` WHERE `private_key`= ?",
          [privateKey],
          function (err, results) {
            if (err) throw reject(new AppError(appCodes.ERROR)); // throw err
            // console.log("moon", results);

            if (typeof results !== "undefined" && results.length === 0) {
              // handling unwanted error
              resolve(null);
            } else {
              resolve(results[0].filename); // resolving the data
            }
          }
        );
      });
    },
    async updateFileStatus(publicKey) {
      // func for updating file download status for inactivity checking
      // Executing the query
      db.query(
        "UPDATE `files` SET `status`='1' WHERE public_key= ?",
        [publicKey],
        function (err, results) {
          if (err) throw new AppError(appCodes.ERROR); // throw err
          // console.log(results);
          return results; // returning the delete data
        }
      );

      return true;
    },
    async deleteFilesFromDb(privateKey) {
      // func to call delete files data from db
      // Executing the query
      return new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM `files` WHERE `private_key`= ?",
          [privateKey],
          function (err, results) {
            if (err) reject(null); // throw err
            console.log(results);
            resolve(results);
          }
        );
      }); // this will return promise with delete data
    },
    async saveUserLogs(data) {
      // func to save user logs
      // Executing the query
      return new Promise((resolve, reject) => {
        let query = `INSERT INTO user_logs 
        (ip_address, created_at, updated_at) VALUES ?;`;

        const dataToInsert = [data.ip_address, now(), now()];
        // Executing the query
        db.query(query, [dataToInsert], (err, results, fields) => {
          if (err) throw new AppError(appCodes.ERROR); // throw err
          resolve(results);
        });
      }); // using promise to handle the saving data
    },
  };
};
