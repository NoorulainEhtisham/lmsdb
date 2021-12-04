// import express from 'express';
// import oracledb from 'oracledb';

const express = require('express');
const oracledb = require('oracledb');

const app = express();

app.get('/', function (req, res) {
    res.send('here')
});

module.exports = app;