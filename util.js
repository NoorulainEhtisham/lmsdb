const express = require('express');
const moment = require('moment');

const app = express();

function arrayToJSON(col, data) {

    const finalArray = [];


    data.forEach((row, ri) => {
        var obj = {};
        col.forEach((c, ci) => {
            if (c.includes('DATE') && row[ci] != null) {
                obj[c] = moment(row[ci]).format('DD-MMM-YY');
            }
            else obj[c] = row[ci];
        })
        finalArray.push(obj);
    });

    return finalArray;
}

module.exports = arrayToJSON;