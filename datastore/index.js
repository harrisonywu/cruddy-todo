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

/* update notes
goal: rewrite the todo item stores in dataDir based on its ID
functionality: when we update the form, we'll change the text that is within that todo's id file

*/


// exports.update = (id, text, callback) => {

//   fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, text) => {
//     if (err) {
//         callback(new Error(`No item with id: ${id}`));
//       } else {
//         callback(null, { id, text});
//       }
//   });
// };


// text parameter below is the updated text
exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`)); 
    } else {
      fileData = text;
      fs.writeFile(`${exports.dataDir}/${id}.txt`, fileData, (err, fileData) => {
        if (err) {
          throw 'error writing file';
        } else {
          callback(null, { id, text: fileData});
        }
      });
    }
  });
};

// exports.update = (id, text, callback) => {
//   var item = items[id];
//   if (!item) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     items[id] = text;
//     callback(null, { id, text });
//   }
// };

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
