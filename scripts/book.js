import express from 'express';
import oracledb from 'oracledb';

const app = express();
const port = 4000;

const connectionString = {
  user: "hr",
  password: "hr",
  connectString: "localhost:1521/orclpdb"
}


export async function selectAllBooks(req, res) {

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
  
export  async function selectBooksById(req, res, id) {
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

export async function deleteBookByID ( req, res) {
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

export async function updateBook ( req, res) {
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

export async function insertBook ( req, res) {
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