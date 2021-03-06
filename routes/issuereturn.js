
const express = require('express');
const oracledb = require('oracledb');
const { consoleTestResultHandler } = require('tslint/lib/test');
const arrayToJSON = require('../util');

oracledb.autoCommit = true;

const app = express();

const connectionString = {
  user: "hr",
  password: "hr",
  connectString: "localhost:1521/orclpdb"
}

let connection = undefined, result = undefined;

//Admin and User are shown separate details
app.get('/getAllAdminSide', function (req, res) {
  selectAllIssueReturnsAdminSide(req, res);
})
app.post('/getAllUserSide', function (req, res) {
  selectAllIssueReturnsUserSide(req, res);
})


//delete single record
app.delete('/deletebyid', (req, res) => {
  deleteIssueReturnByID(req, res);
});

//update single record
app.put('/updatebyid', (req, res) => {
  updateIssueReturn(req, res);
});

// insertion by Issue button by user
app.post('/insert', (req, res) => {
  console.log(req.body, 'createData');
  insertIssueReturn(req, res);
});

//insertion by admin
app.post('/insertbyadmin', (req, res) => {
  console.log(req.body, 'createData');
  insertbyadminIssueReturn(req, res);
});

async function selectAllIssueReturnsAdminSide(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all records
    result = await connection.execute(`SELECT * FROM issue_return`);

    if (result?.rows?.length == 0) {
      //query returns zero records
      return res.send('no rows found');
    } else {
      //send all records
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
        // close connections
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

    // run query to get user relevant columns
    result = await connection.execute(` select b.Title, ir.Issue_date,ir.due_date,ir.amount_fine,ir.late_fine,ir.return_date,ir.fine_date from books b join copies c on b.Book_ID = c.Book_id join Issue_return ir on c.copy_id=ir.copy_id where member_id=${user_id}`);
    if (result?.rows?.length == 0) {
      //query returns zero records
      return res.send('no rows found');
    } else {
      //send all records
      console.log('result', result);

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
        //close connections
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
    const issuereturn_ID = parseInt(req.body.id); //frontend sent String, convert it to number
    const deleteQuery = `delete from issue_return where issue_id=${issuereturn_ID}`;
    console.log(deleteQuery);
    result = await connection.execute(deleteQuery);
    if (result.rows.length == 0) {
      //query return zero records
      return res.send('query send no rows');
    } else {
      return res.send(result.rows);
    }

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Close connections
        await connection.close();
      } catch (err) {
        return console.error(err.message);
      }
    }

  }
}

//update by id (Only Admin can do this)
async function updateIssueReturn(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    console.log('req.body: ', req.body);
    //parse strings sent by frontend to numbers
    const issueid = parseInt(req.body.ISSUE_ID);
    const memberid = parseInt(req.body.MEMBER_ID);
    const copyid = parseInt(req.body.COPY_ID);
    const latefine = parseInt(req.body.LATE_FINE);
    const amountfine = parseInt(req.body.AMOUNT_FINE);

    //RETURN_DATE = TO_Date(${returndate},'dd-mon-yyyy')'
    //returndate=TO_DATE('12-JAN-20','dd-mon-yyyy'))
    //Fixing format for db query
    //if null, send object null , if date, send string 'date'
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

    const updateQuery = `update issue_return set member_id=${memberid},copy_id=${copyid},issue_date=TO_Date(${issuedate},'dd-mon-yyyy'),due_date=TO_Date(${duedate},'dd-mon-yyyy'),late_fine=${latefine}, return_date=TO_Date(${returndate},'dd-mon-yyyy'),fine_date=TO_Date(${finedate},'dd-mon-yyyy'),amount_fine=${amountfine} where issue_id = ${issueid}`;

    console.log('update query: ', updateQuery);
    result = await connection.execute(updateQuery);
    console.log('result of update query: ', result);
    if (result.rows.length == 0) {
      //query returns zero records
      return res.send('query send no rows');
    } else {
      return res.send(result.rows);
    }

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Close connections
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