const express = require('express');

const app = express();

function arrayToJSON ( col, data){

    const finalArray = [];
  

    data.forEach((row, ri)=>{
      var obj = {};
      col.forEach((c, ci)=>{
        obj[c] = row[ci];
      })
      finalArray.push(obj);
    });

    return finalArray;
}

module.exports = arrayToJSON;