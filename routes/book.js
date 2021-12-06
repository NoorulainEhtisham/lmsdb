// import express from 'express';
// import oracledb from 'oracledb';
const express = require('express');
const oracledb = require('oracledb');
const arrayToJSON = require('../util')


const app = express();

const connectionString = {
  user: "hr",
  password: "hr",
  connectString: "localhost:1521/orclpdb"
}

let connection = undefined, result = undefined;

//get /getAllBooks
app.get('/getAll', function (req, res) {
  selectAllBooks(req, res);
})

//get /book?id=<id book>
app.get('/getbyid', function (req, res) {
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
app.delete('/deletebyid/:id', (req,res)=>{
  deleteBookByID(req, res);
});

//update single data
app.put('/updatebyid/:id', (req,res)=>{
  console.log(req.body,'updatedata');
  updateBook(req, res);
});

// insertion
app.post('/insert', (req,res)=>{
  console.log(req.body,'createData'); 
  insertBook(req, res);
});


async function selectAllBooks(req, res) {

    try {

      console.log('connected to database');
      connection = await oracledb.getConnection(connectionString);
  
      
      // run query to get all books
      result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories from books`);

      // result = await connection.execute(`select * from books b join book_author ba on b.book_id=ba.book_id join authors a on ba.author_id=a.author_id 
      // join book_category bc on b.book_id=bc.book_id join category c on bc.category_id = c.category_id `);

      if (result?.rows?.length == 0) {
        //query return zero books
        return res.send('no rows found');
      } else {
        //send all books
       
        const columns = result.metaData.map((col) => col.name);
        const data = result.rows;
        const finalArray = arrayToJSON(columns, data);

        return res.send(finalArray);
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
      //result = await connection.execute(`SELECT * FROM books where book_id=:id`, [id]);
       //result = await connection.execute(`select book_Title(${id}) as Title, book_Authors(${id}) as Authors, book_Categories(${id})as Categories from dual`);
      result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories, publisher_id
, date_of_publish, description, cost, ISBN from books where book_id=${id}`);
      // console.log(result);
      if (result.rows.length == 0) {
        //query return zero books
        return res.send('query send no rows');
      } else {
        const columns = result.metaData.map((col) => col.name);
        const data = result.rows;
        const finalArray = arrayToJSON(columns, data);

        return res.send(finalArray[0]);
        //send all books
        //return res.send(result.rows);
      }
  
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
     
    }
}

async function deleteBookByID ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const book_ID=req.params.id;

    result = await connection.execute(`delete from books where book_id='${book_ID}'`);

    if (result.rows.length == 0) {
      //query return zero books
      return res.send('query send no rows');
    } else {
      //send all books
      return res.send(result.rows);
    }

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

    if (result.rows.length == 0) {
      //query return zero books
      return res.send('query send no rows');
    } else {
      //send all books
      return res.send(result.rows);
    }

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
    if (result.rows.length == 0) {
      //query return zero books
      return res.send('query send no rows');
    } else {
      //send all books
      return res.send(result.rows);
    }

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
    
  }
}


module.exports = app;