const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//   items[id] = text;
//   callback(null, { id, text });
// };

exports.create = (text, callback) => {
  // text is our passed in data from POST request
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




// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id: text };
//   });
//   callback(null, data);
// };

exports.readAll = (callback) => {
  var data = []; 
  fs.readdir(`${exports.dataDir}/`, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      files.forEach((fileName) => {
        fileName = fileName.slice(0, -4);
        data.push({id: fileName, text: fileName});
        // console.log('2nd test', data);
        // console.log('files test:', files);
      });
      console.log('OUR DATA: ', data);
      callback(null, data);
    }
  });
  // return data;
};

// exports.readOne = (id, callback) => {
//   fs.readFile(`./datastore/data/${id}`, (err, fileData) => {
//     if (err) {
//       cb(null, 0);
//     } else {
//       if (!fileData) {
//         cb('No item with the id:', id);
//       } else {
//         cb(null, {id: id, text: (fileData).toString()});
//       }
//     }
//   });
// };

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    console.log(typeof(fileData));
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fileData = (fileData).toString();
      callback(null, { id, text: fileData });
    }
  })
};

// exports.readOne = (id, callback) => {
//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text });
//   }
// };

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

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
