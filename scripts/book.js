const express = require('express')
const oracledb = require('oracledb');
const app = express();
const port = 4000;
const connectionString = {
    user: "hr",
    password: 'hr',
    connectString: "localhost:1521/orclpdb"
};


async function selectAllBooks(req, res) {
    try {
      connection = await oracledb.getConnection(connectionString);
  
      console.log('connected to database');
      // run query to get all books
      result = await connection.execute(`SELECT * FROM Books`);
  
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('close connection success');
        } catch (err) {
          console.error(err.message);
        }
      }
      if (result.rows.length == 0) {
        //query return zero books
        return res.send('query send no rows');
      } else {
        //send all books
        return res.send(result.rows);
      }
  
    }
  }
  
book.exports = {
    selectAllBooks
}