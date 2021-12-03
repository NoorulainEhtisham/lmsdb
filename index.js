const express = require('express')
const oracledb = require('oracledb');
const app = express();


import {selectAllBooks} from './scripts/book.js';

const port = 4000;
const connectionString = {
    user: "hr",
    password: 'hr',
    connectString: "localhost:1521/orclpdb"
};


//get /getAllBooks
app.get('/getAllBooks', function (req, res) {
  selectAllBooks(req, res);
})

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

///////////////////////////////////////////////////

//delete single data 
app.delete('/book/:id', (req,res)=>{

  let book_ID=req.params.id;

  let qr=`delete from books where book_id='${book_ID}' `;

  db.query(qr,(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      res.send({
          message:'data deleted'
      });
  });

});

//update single data
app.put('/book/:id', (req,res)=>{
  console.log(req.body,'updatedata');

  let book_ID=req.params.book_id;
  let title= req.body.title;
  let publisher_id= req.body.publisher_id;
  let date_of_publish= req.body.Date_of_publish;
  let description= req.body.Description;
  let cost= req.body.cost;
  let ISBN= req.body.ISBN;

  let qr=`update books set title='${title}',publisher_id='${publisher_id}',date_of_publish='${date_of_publish}',description='${description}',cost='${cost}',ISBN='${ISBN}'
          where book_id = ${book_ID}`;

  db.query(qr,(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      res.send({
          message:'data updated',
      });
  });

});

// insertion
app.post('/book', (req,res)=>{
  console.log(req.body,'createData'); 

  let book_ID=req.params.book_id;
  let title= req.body.title;
  let publisher_id= req.body.publisher_id;
  let date_of_publish= req.body.Date_of_publish;
  let description= req.body.Description;
  let cost= req.body.cost;
  let ISBN= req.body.ISBN;

  let qr=`insert into books(book_id,title,publisher_id,date_of_publish,description,cost,isbn) values('${book_ID}','${title}','${publisher_id}','${date_of_publish}','${description}','${cost}','${ISBN}')`;

  db.query(qr,(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      res.send({
          message:'data inserted',
      });
  });

});

///////////////////////////////////////////////////

app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))
