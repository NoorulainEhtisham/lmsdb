// import express from 'express';
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/book');
const authorRoutes = require('./routes/author');
// import bookRoutes from './routes/book.js';
// import authorRoutes from './routes/author.js';

// const connectionString = {
//   user: "hr",
//   password: "hr",
//   connectString: "localhost:1521/orclpdb"
// }
// connection = await oracledb.getConnection(connectionString);

const app = express();

app.use(bodyParser.json());
app.use("/book", bookRoutes);
app.use("/author", authorRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log("Node Server is Running on ", PORT);
});

module.exports = app;
