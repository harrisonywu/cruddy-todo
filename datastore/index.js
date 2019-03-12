const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, string) => {
    console.log(string);
    //string is our zeroPaddedNumber
    var id = string;
    items[id] = text;
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error writing file');
      }
      callback(null, {id: id, text: text});
    });
  });
};

exports.readAll = (callback) => {
  var data = []; 
  fs.readdir(`${exports.dataDir}/`, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      files.forEach((fileName) => {
        fileName = fileName.slice(0, -4);
        data.push({id: fileName, text: fileName});
      });
      console.log('OUR DATA: ', data);
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    console.log(typeof(fileData));
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fileData = (fileData).toString();
      callback(null, { id, text: fileData });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err); 
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (fileData) => {
        callback(null, { id, text: fileData});
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err, data) => {
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
