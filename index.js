
import express from 'express';
import oracledb from 'oracledb';
import {selectBooksById, selectAllBooks, deleteBookByID, updateBook, insertBook} from './scripts/book.js'

const app = express();
const port = 3000;

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


app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))
