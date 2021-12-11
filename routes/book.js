// import express from 'express';
// import oracledb from 'oracledb';
const express = require('express');
const oracledb = require('oracledb');
const arrayToJSON = require('../util');

oracledb.autoCommit = true;


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

app.get('/getAllData', function (req, res) {
  selectAllBooksData(req, res);
})

app.get('/getAllCopies', function (req, res) {
  selectAllCopies(req, res);
})

//get /book?id=<id book>
app.get('/getbyid', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    console.log(id);
    res.send(`Query param id is not number`)
    return
  }
  selectBooksById(req, res, id);
})

app.get('/getCopiesbyid', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    console.log(id);
    res.send(`Query param id is not number`)
    return
  }
  selectCopiesById(req, res, id);
})

//delete single data 
app.delete('/deletebyid/:id', (req, res) => {
  deleteBookByID(req, res);
});

//delete one book copy
app.delete('/deleteCopy', (req, res) => {
  deleteCopy(req, res);
});

//update single data
app.put('/updatebyid/:id', (req, res) => {
  console.log(req.body, 'updatedata');
  updateBook(req, res);
});

//update copy
app.put('/updateCopy', (req, res) => {
  console.log(req.body, 'updatedata');
  updateCopy(req, res);
});

// insertion
app.post('/insert', (req, res) => {
  console.log(req.body, 'createData');
  insertBook(req, res);
});

app.post('/insertCopy/:id', (req, res) => {
  console.log(req.body, 'Copy')
  insertCopy(req, res)
})
async function selectAllBooksData(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories, publisher_id
    , date_of_publish, description, cost, ISBN, book_copies(book_id) as AvailableCopies from books`);

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

async function selectAllCopies(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`select * from Copies`);

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
    , date_of_publish, description, cost, ISBN, book_copies(book_id) as AvailableCopies from books where book_id=${id}`);
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


async function selectCopiesById(req, res, id) {
  try {
    connection = await oracledb.getConnection(connectionString);
    // run query to get book with book_id
    //result = await connection.execute(`SELECT * FROM books where book_id=:id`, [id]);
    //result = await connection.execute(`select book_Title(${id}) as Title, book_Authors(${id}) as Authors, book_Categories(${id})as Categories from dual`);
    result = await connection.execute(`select * from COPIES where BOOK_ID=${id}`);
    // console.log(result);
    if (result.rows.length == 0) {
      //query return zero books
      return res.send('No records to display');
    } else {
      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.send(finalArray);
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

async function deleteCopy(req, res){
  try{
        connection = await oracledb.getConnection(connectionString);
        const copyidno = req.body.COPY_ID;
        console.log(req.body)
        result = await connection.execute(`delete from COPIES where COPY_ID =${copyidno}`);
        console.log('Result', result)

        // if (result.rows.length == 0) {
        //   //query return zero books
        //   return res.send('query send no rows');
        // } else {
        //   //send all books
          return res.send(result.rows);
        //}      

  } catch(err) {
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        return console.error(err.message);
        
      }
    }

  }    
}


async function deleteBookByID(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    const book_ID = req.params.id;

    query = await connection.execute(`delete from books where book_id='${book_ID}'`);
    result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories, publisher_id
    , date_of_publish, description, cost, ISBN, book_copies(book_id) as AvailableCopies from books`);
    //if (result.rows.length == 0) {
      //query return zero books
      //return res.send('query send no rows');
    //} else {
      //send all books
      return res.send(result);
    //}

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

async function insertCopy(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

  const book_id = parseInt(req.params.id);
  console.log(book_id)
  const Shelf_no = parseInt(req.body.SHELF_NO);
  console.log(Shelf_no)
  query = await connection.execute(`insert into COPIES values(${null}, ${book_id}, 'Available', ${Shelf_no})`);
  result = await connection.execute(`select * from COPIES where BOOK_ID=${book_id}`);
  console.log("Result",result.rows)

  //if (result.rows.length == 0) {
    //query return zero books
    //return res.send('query send no rows');
  //} else {
    //send all books
    return res.send('Data inserted',result);
  //}

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

async function updateCopy(req, res){
  try {
    connection = await oracledb.getConnection(connectionString);

    const copyid = req.body.COPY_ID;
    const bookid = req.body.BOOK_ID;
    const status = req.body.STATUS;
    const Shelf_no = req.body.SHELF_NO;

    result = await connection.execute(`update COPIES set BOOK_ID='${bookid}', STATUS='${status}', SHELF_NO='${Shelf_no}' where COPY_ID = ${copyid}`);

    console.log(req.body)

    // if (result.rows.length == 0) {
    //   //query return zero books
    //   return res.send('query send no rows');
    // } else {
      //send all books
      //return res.send(result.rows);
    //}

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

async function updateBook(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);


    const book_ID = parseInt(req.params.id);
    const title = req.body.TITLE;
    const publisher_id = parseInt(req.body.PUBLISHER_ID);
    const date_of_publish = req.body.DATE_OF_PUBLISH;
    const description = req.body.DESCRIPTION;
    const cost = parseInt(req.body.COST);
    const ISBN = req.body.ISBN;
    //console.log(description)

    const query = `UPDATE BOOKS SET BOOK_ID=${book_ID}, TITLE ='${title}', PUBLISHER_ID = ${publisher_id} , DATE_OF_PUBLISH = TO_Date('${date_of_publish}','dd-mon-yyyy'), DESCRIPTION = '${description}', COST= ${cost}, ISBN='${ISBN}' where BOOK_ID = ${book_ID}`;
    console.log(query);
    result = await connection.execute(query);
    /*result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories, publisher_id
    , date_of_publish, description, cost, ISBN from books where BOOK_ID= ${book_ID}`)*/

    //if (result.rows.length == 0) {
      //return zero books
      //return res.send('query send no rows');
    //} else {
      //send all books
      return res.send('Data updated successfully', result);
    //}

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

async function insertBook(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    //const book_ID = req.params.book_id;
    const title = req.body.TITLE;
    const publisher_id = parseInt(req.body.PUBLISHER_ID);
    const date_of_publish = req.body.DATE_OF_PUBLISH;
    const ISBN = req.body.ISBN;

    query = await connection.execute(`insert into books(book_id,title,publisher_id,date_of_publish,isbn) values(${null},'${title}', '${publisher_id}', TO_Date('${date_of_publish}','dd-mon-yyyy'),'${ISBN}')`);
    book__id = await connection.execute(`select book_id from BOOKS where ISBN = '${ISBN}'`)
    // console.log('Bookid', book__id.rows[0][0])
    // addcopy = await connection.execute(`insert into copies() values (${null}, ${book__id.rows[0][0]}, 'Available')`)
    result = await connection.execute(`select book_id, book_Title(book_id) as Title, book_Authors(book_id) as Authors, book_Categories(book_id)as Categories, publisher_id
    , date_of_publish, description, cost, ISBN, book_copies(book_id) as AvailableCopies from books`);
    //alert(result)
    if (result.rows.length == 0) {
      //query return zero books
      return res.send('query send no rows');
    } else {
      //send all books
      return res.send(result);
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