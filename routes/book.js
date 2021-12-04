// import express from 'express';
// import oracledb from 'oracledb';
const express = require('express');
const oracledb = require('oracledb');

const app = express();

const connectionString = {
  user: "hr",
  password: "hr",
  connectString: "localhost:1521/orclpdb"
}

let connection = undefined, result = undefined;

//get /getAllBooks
app.get('/getAllBooks', function (req, res) {
  selectAllBooks(req, res);
})

//get /book?id=<id book>
app.get('/book', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    console.log(id);
    res.send('Query param id is not number')
    return
  }
  selectBooksById(req, res, id);
})

//delete single data 
app.delete('/book/:id', (req,res)=>{
  deleteBookByID(req, res);
});

//update single data
app.put('/book/:id', (req,res)=>{
  console.log(req.body,'updatedata');
  updateBook(req, res);
});

// insertion
app.post('/book', (req,res)=>{
  console.log(req.body,'createData'); 
  insertBook(req, res);
});


async function selectAllBooks(req, res) {

    try {

      console.log('connected to database');
      connection = await oracledb.getConnection(connectionString);
  
      
      // run query to get all books
      result = await connection.execute(`SELECT * FROM Books`);

      if (result?.rows?.length == 0) {
        //query return zero books
        //return res.send('query send no rows');
        return res.status(400).json({
          status: 'error',
          error: 'query send no rows',
        });
      } else {
        //send all books
        //return res.send(result?.rows);
        return res.status(200).json({
          status: 'succes',
          data: result?.rows
        });
      }
  
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

    }
}
  
async function selectBooksById(req, res, id) {
    try {
      connection = await oracledb.getConnection(connectionString);
      // run query to get book with book_id
      result = await connection.execute(`SELECT * FROM books where book_id=:id`, [id]);
  
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close(); 
        } catch (err) {
          return console.error(err.message);
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

async function deleteBookByID ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const book_ID=req.params.id;

    result = await connection.execute(`delete from books where book_id='${book_ID}'`);

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close(); 
      } catch (err) {
        return console.error(err.message);
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

async function updateBook ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const book_ID=req.params.book_id;
    const title= req.body.title;
    const publisher_id= req.body.publisher_id;
    const date_of_publish= req.body.Date_of_publish;
    const description= req.body.Description;
    const cost= req.body.cost;
    const ISBN= req.body.ISBN;


    result = await connection.execute(`update books set title='${title}',publisher_id='${publisher_id}',date_of_publish='${date_of_publish}',description='${description}',cost='${cost}',ISBN='${ISBN}'
    where book_id = ${book_ID}`);

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close(); 
      } catch (err) {
        return console.error(err.message);
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

async function insertBook ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const book_ID=req.params.book_id;
    const title= req.body.title;
    const publisher_id= req.body.publisher_id;
    const date_of_publish= req.body.Date_of_publish;
    const description= req.body.Description;
    const cost= req.body.cost;
    const ISBN= req.body.ISBN;

    result = await connection.execute(`insert into books(book_id,title,publisher_id,date_of_publish,description,cost,isbn) values('${book_ID}','${title}','${publisher_id}','${date_of_publish}','${description}','${cost}','${ISBN}')`);

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close(); 
      } catch (err) {
        return console.error(err.message);
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


module.exports = app;