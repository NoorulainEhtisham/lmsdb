const express = require('express');
const oracledb = require('oracledb');

const app = express();

const connectionString = {
    user: "hr",
    password: "hr",
    connectString: "localhost:1521/orclpdb"
  }

// app.get('/', function (req, res) {
//     res.send('here')
// });

//////////////

let connection = undefined, result = undefined;

//get /getAllAuthors
app.get('/getAll', function (req, res) {
  selectAllAuthors(req, res);
})

//get /author?id=<id author>
app.get('/getbyid', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    console.log(id);
    res.send('Query param id is not number')
    return
  }
  selectAuthorsById(req, res, id);
})

//delete single data 
app.delete('/deletebyid/:id', (req,res)=>{
  deleteAuthorByID(req, res);
});

//update single data
app.put('/updatebyid/:id', (req,res)=>{
  console.log(req.body,'updatedata');
  updateAuthor(req, res);
});

// insertion
app.post('/insert', (req,res)=>{
  console.log(req.body,'createData'); 
  insertAuthor(req, res);
});


async function selectAllAuthors(req, res) {

    try {

      console.log('connected to database');
      connection = await oracledb.getConnection(connectionString);
  
      
      // run query to get all books
      result = await connection.execute(`SELECT * FROM Authors`);

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
  
async function selectAuthorsById(req, res, id) {
    try {
      connection = await oracledb.getConnection(connectionString);
      // run query to get book with book_id
      result = await connection.execute(`SELECT * FROM Authors where author_id=:id`, [id]);

      if (result.rows.length == 0) {
        //query return zero authors
        return res.send('query send no rows');
      } else {
        //send all authors
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

async function deleteAuthorByID ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const author_ID=req.params.id;

    result = await connection.execute(`delete from authors where Author_id='${author_ID}'`);

    if (result.rows.length == 0) {
      //query return zero authors
      return res.send('query send no rows');
    } else {
      //send all authors
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

async function updateAuthor ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const author_ID=req.params.book_id;
    const first_name= req.body.first_name;
    const last_name= req.body.last_name;
    const email= req.body.email;

    result = await connection.execute(`update authors set first_name='${first_name}',last_name='${last_name}',email='${email}'
    where author_id = ${author_ID}`);

    if (result.rows.length == 0) {
      //query return zero authors
      return res.send('query send no rows');
    } else {
      //send all authors
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

async function insertAuthor ( req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    
    const author_ID=req.params.book_id;
    const first_name= req.body.first_name;
    const last_name= req.body.last_name;
    const email= req.body.email;


    result = await connection.execute(`insert into authors(author_id,first_name,last_name,email) values('${author_ID}','${first_name}','${last_name}','${email}')`);
    if (result.rows.length == 0) {
      //query return zero authors
      return res.send('query send no rows');
    } else {
      //send all authors
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


//////////////

module.exports = app;