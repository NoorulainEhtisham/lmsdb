
const express = require('express');
const oracledb = require('oracledb');
const { consoleTestResultHandler } = require('tslint/lib/test');
const arrayToJSON = require('../util');

oracledb.autoCommit = true; //add this to all files

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

app.post('/insertbyadmin', (req, res) => {
  console.log(req.body, 'createData');
  insertbyadminIssueReturn(req, res);
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
    // result = await connection.execute(`SELECT Issue_date,due_date,late_fine,return_date,fine_date,amount_fine FROM issue_return where member_id=${user_id}`);
    result = await connection.execute(` select b.Title, ir.Issue_date,ir.due_date,ir.amount_fine,ir.late_fine,ir.return_date,ir.fine_date from books b join copies c on b.Book_ID = c.Book_id join Issue_return ir on c.copy_id=ir.copy_id where member_id=${user_id}`);
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
    console.log(req.body);
    const issuereturn_ID = parseInt(req.body.id);
    const deleteQuery = `delete from issue_return where issue_id=${issuereturn_ID}`;
    console.log(deleteQuery);
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
    console.log('req.body: ', req.body);
    const issueid = parseInt(req.body.ISSUE_ID);
    const memberid = parseInt(req.body.MEMBER_ID);
    const copyid = parseInt(req.body.COPY_ID);
    const latefine = parseInt(req.body.LATE_FINE);
    const amountfine = parseInt(req.body.AMOUNT_FINE);

    let returndate = '';
    if (req.body.RETURN_DATE) {
      returndate = "\'".concat(req.body.RETURN_DATE);
      returndate = returndate.concat("\'");
    } else {
      returndate = null;
    }
    let issuedate = '';
    if (req.body.ISSUE_DATE) {
      issuedate = "\'".concat(req.body.ISSUE_DATE);
      issuedate = issuedate.concat("\'");
    } else {
      issuedate = null;
    }
    let duedate = '';
    if (req.body.DUE_DATE) {
      duedate = "\'".concat(req.body.DUE_DATE);
      duedate = duedate.concat("\'");
    } else {
      duedate = null;
    }
    let finedate = '';
    if (req.body.FINE_DATE) {
      finedate = "\'".concat(req.body.FINE_DATE);
      finedate = finedate.concat("\'");
    } else {
      finedate = null;
    }
    // const return_status = req.body.RETURN_STATUS; // MARK STATUS

    //const updateQuery = `update issue_return set member_id=${member_id},copy_id=${copy_id},issue_date=to_utc_timestamp_tz(${issue_date}),due_date=to_utc_timestamp_tz(${due_date}),late_fine=${late_fine}, return_date=to_utc_timestamp_tz(${return_date}),fine_date=to_utc_timestamp_tz(${fine_date}),amount_fine=${amount_fine} where issue_id = ${issue_id}`;
    const updateQuery = `update issue_return set member_id=${memberid},copy_id=${copyid},issue_date=TO_Date(${issuedate},'dd-mon-yyyy'),due_date=TO_Date(${duedate},'dd-mon-yyyy'),late_fine=${latefine}, return_date=TO_Date(${returndate},'dd-mon-yyyy'),fine_date=TO_Date(${finedate},'dd-mon-yyyy'),amount_fine=${amountfine} where issue_id = ${issueid}`;

    console.log('update query: ', updateQuery);
    result = await connection.execute(updateQuery);
    console.log('result of update query: ', result);
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
    const userid = parseInt(req.body.user);
    const bookid = parseInt(req.body.book_id);

    const copyidAssigned = `select assignCopy(${userid}, ${bookid}) from dual`;
    console.log(copyidAssigned);
    result = await connection.execute(copyidAssigned);
    const Copyidavailable = result.rows[0][0];
    console.log('Result', result.rows[0][0]);

    const UpdateStatus = `update copies
    set status = 'Checked Out' where copy_id = ${Copyidavailable}`;
    console.log(UpdateStatus);
    result = await connection.execute(UpdateStatus);
    console.log('Result', result);

    const InsertRecord = `insert into issue_return
    values(null, ${userid},${Copyidavailable}, sysdate, sysdate+14, 0, null, null, 100)`;
    console.log(InsertRecord);
    result = await connection.execute(InsertRecord);
    console.log('Result', result);


    //const getCopyQuery = `select * from copies where book_id = 104 and status='Available' and rownum=1`;
    // const query = `execute issue(${userid}, ${bookid})`;
    // console.log('insert query: ', query);
    // result = await connection.execute(query);
    // console.log(result + 'THE RESULT OF INSERTION');
    // await connection.execute(getCopyQuery).then((copiesgetData) => {
    //   const copy = arrayToJSON(copiesData.metaData.map((col) => col.name), result.rows)[0];
    //   console.log("copy ", copy);

    //   const insertIntoCopies = `update copies set status = 'Checked out' where copy_id = ${copy.copy_id}`;
    //   //await connection.execute(insertIntoCopies).then((copiesData) = {});

    // });

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


async function insertbyadminIssueReturn(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    const memberid = parseInt(req.body.MEMBER_ID);
    const copyid = parseInt(req.body.COPY_ID);
    const latefine = parseInt(req.body.LATE_FINE);
    const amountfine = parseInt(req.body.AMOUNT_FINE);
    let returndate = '';
    if (req.body.RETURN_DATE) {
      returndate = "\'".concat(req.body.RETURN_DATE);
      returndate = returndate.concat("\'");
    } else {
      returndate = null;
    }
    let issuedate = '';
    if (req.body.ISSUE_DATE) {
      issuedate = "\'".concat(req.body.ISSUE_DATE);
      issuedate = issuedate.concat("\'");
    } else {
      issuedate = null;
    }
    let duedate = '';
    if (req.body.DUE_DATE) {
      duedate = "\'".concat(req.body.DUE_DATE);
      duedate = duedate.concat("\'");
    } else {
      duedate = null;
    }
    let finedate = '';
    if (req.body.FINE_DATE) {
      finedate = "\'".concat(req.body.FINE_DATE);
      finedate = finedate.concat("\'");
    } else {
      finedate = null;
    }

    const inserts = `insert into issue_return values(null, ${memberid},${copyid},TO_Date(${issuedate},'dd-mon-yyyy'),TO_Date(${duedate},'dd-mon-yyyy'),${latefine},TO_Date(${returndate},'dd-mon-yyyy'),TO_Date(${finedate},'dd-mon-yyyy'),${amountfine})`;
    console.log(inserts);
    result = await connection.execute(inserts);
    console.log('Result', result);
    res.send(result);

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