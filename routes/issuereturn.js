
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
app.get('/getAllAdminSide', function (req, res) {
  selectAllIssueReturnsAdminSide(req, res);
})
app.post('/getAllUserSide', function (req, res) {
  selectAllIssueReturnsUserSide(req, res);
})


//delete single data 
app.delete('/deletebyid', (req, res) => {
  deleteIssueReturnByID(req, res);
});

//update single data
app.put('/updatebyid', (req, res) => {
  updateIssueReturn(req, res);
});

// insertion
app.post('/insert', (req, res) => {
  console.log(req.body, 'createData');
  insertIssueReturn(req, res);
});


async function selectAllIssueReturnsAdminSide(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM issue_return`);

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

async function selectAllIssueReturnsUserSide(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);

    const user_id = req.body.user_id;

    // run query to get all books
    result = await connection.execute(`SELECT Issue_date,due_date,late_fine,return_date,fine_date,amount_fine FROM issue_return where member_id=${user_id}`);

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

async function deleteIssueReturnByID(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    const issuereturn_ID = parseInt(req.params.id);
    const deleteQuery = `delete from issue_return where issue_id=${issuereturn_ID}`;
    result = await connection.execute(deleteQuery);

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

async function updateIssueReturn(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    const issue_id = parseInt(req.body.ISSUE_ID);
    const member_id = parseInt(req.body.MEMBER_ID);
    const copy_id = parseInt(req.body.COPY_ID);
    const issue_date = req.body.ISSUE_DATE;
    const due_date = req.body.DUE_DATE;
    const late_fine = parseInt(req.body.LATE_FINE);
    const return_date = req.body.RETURN_DATE;
    const fine_date = req.body.FINE_DATE;
    const amount_fine = parseInt(req.body.AMOUNT_FINE);

    const updateQuery = `update issue_return set member_id=${member_id},copy_id=${copy_id},issue_date=to_utc_timestamp_tz('${issue_date}'),due_date=to_utc_timestamp_tz('${due_date}'), return_date=to_utc_timestamp_tz('${return_date}'),late_fine=${late_fine},amount_fine=${amount_fine} where issue_id = ${issue_id}`;

    result = await connection.execute(updateQuery);

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

async function insertIssueReturn(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    console.log('received ', req);

    //const getCopyQuery = `select * from copies where book_id = 104 and status='Available' and rownum=1`;
    const query = `execute issue(${parseInt(req.body.user)}, ${parseInt(req.body.book_id)})`;
    console.log('insert query ', query);
    result = await connection.execute(query);
    console.log(result + 'THE RESULT OF INSERTION');
    // await connection.execute(getCopyQuery).then((copiesgetData) => {
    //   const copy = arrayToJSON(copiesData.metaData.map((col) => col.name), result.rows)[0];
    //   console.log("copy ", copy);

    //   const insertIntoCopies = `update copies set status = 'Checked out' where copy_id = ${copy.copy_id}`;
    //   //await connection.execute(insertIntoCopies).then((copiesData) = {});

    // });






    //const insertIntoCopies = `update copies set status = 'Checked out' where copy_id = ${copy.copy_id}`;
    //const insertIntoIssueReturn = `insert into issue_return values (${req.body.user}, ${copy.copy_id}, sysdate(), sysdate()+14, 100, null, null, null)`


    // const issue_id=req.params.issue_id;
    // const member_id= req.body.member_id;
    // const copy_id= req.body.copy_id;
    // const issue_date= req.body.issue_date;
    // const due_date= req.body.due_date;
    // const late_fine= req.body.late_fine;
    // const return_date= req.body.return_date;
    // const fine_date= req.body.fine_date;
    // const amount_fine= req.body.amount_fine;

    res.send(result);

    // result = await connection.execute(`insert into issue_return(issue_id,member_id,copy_id,issue_date,due_date,late_fine,return_date,fine_date,amount_fine) values('${issue_id}','${member_id}','${copy_id}','${issue_date}','${due_date}','${late_fine}','${return_date}'),'${fine_date}','${amount_fine}'`);
    // if (result.rows.length == 0) {
    //   //query return zero books
    //   return res.send('query send no rows');
    // } else {
    //   //send all books
    //   return res.send(result.rows);
    // }

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