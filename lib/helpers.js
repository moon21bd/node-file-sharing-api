"use strict";

exports.uuid = () => {
  // this func will generate random uuid
  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  const xAndYOnly = /[xy]/g;

  return template.replace(xAndYOnly, (character) => {
    const randomNo = Math.floor(Math.random() * 16);
    const newValue = character === "x" ? randomNo : (randomNo & 0x3) | 0x8;

    return newValue.toString(16);
  });
};
exports.now = () => {
  // this func will generate current time
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

exports.uniqueKeyGenerator = () => {
  // this func will generate unique key
  // always start with a letter
  var idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    var ascicode = Math.floor(Math.random() * 42 + 48);
    if (ascicode < 58 || ascicode > 64) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 32);

  return idstr;
};

exports.getIPAddress = (req) => {
  // func to get IP address of user
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
};
