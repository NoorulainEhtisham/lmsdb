//const express = require('express')
//const oracledb = require('oracledb');

import express from 'express';
import oracledb from 'oracledb';
import {selectAllEmployees, selectEmployeesById} from './scripts/book.js'

const app = express();
const port = 3000;

//get /employess
app.get('/employees', function (req, res) {
  selectAllEmployees(req, res);
})

//get /employee?id=<id employee>
app.get('/employee', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    res.send('Query param id is not number')
    return
  }
  selectEmployeesById(req, res, id);
})

app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))
