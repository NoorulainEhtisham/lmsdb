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

//get list of all members
app.get('/getAll', function (req, res) {
  selectAllMembers(req, res);
})

app.get('/get/:id', function (req, res) {
  selectMember(req, res);
})

app.get('/getadmin', function (req, res) {
  selectAdmin(req, res)
})

app.get('/getUsers', function (req, res) {
  selectUsers(req, res)
})

app.get('/getUsers/:id', function (req, res) {
  selectUser(req, res)
})

//add new member
app.post('/insert', function (req, res) {
  console.log(req.body, "insert data")
  AddMember(req, res);
})

app.put('/edit/:id', function (req, res) {
  console.log(req.body, "insert data")
  editMember(req, res)
})
app.delete('/remove/:id', function (req, res) {
  console.log(req.body, "insert data")
  removeMember(req, res)
})

async function selectAdmin(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM MEMBERS WHERE TITLE_ID=1`);

    if (result?.rows?.length == 0) {
      //query return zero books
      return res.status(400).json({
        status: 'error',
        error: 'query send no rows',
      });
    } else {
      //send all books
      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.status(200).json({
        status: 'success',
        data: finalArray
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

async function selectMember(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM MEMBERS WHERE MEMBER_ID=${req.params.id}`);

    if (result?.rows?.length == 0) {
      //query return zero books
      return res.status(400).json({
        status: 'error',
        error: 'query send no rows',
      });
    } else {
      //send all books
      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.status(200).json({
        status: 'success',
        data: finalArray
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

async function removeMember(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    const memberid = req.params.id;

    result = await connection.execute(`delete from MEMBERS where MEMBER_ID='${memberid}'`);

    return res.send(result);


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

async function editMember(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);
    const memberid = req.params.id

    const first_name = req.body.FIRST_NAME
    const last_name = req.body.LAST_NAME
    const email = req.body.EMAIL
    const phoneNo = req.body.PHONE_NUMBER
    const DOB = req.body.DATE_OF_BIRTH
    const address = req.body.ADDRESS
    const password = req.body.PASSWORD

    result = await connection.execute(`UPDATE MEMBERS SET FIRST_NAME='${first_name}', LAST_NAME='${last_name}', PHONE_NUMBER='${phoneNo}',
      DATE_OF_BIRTH=TO_Date('${DOB}','dd-mon-yyyy'), ADDRESS='${address}', EMAIL='${email}', PASSWORD='${password}' WHERE MEMBER_ID='${memberid}'`);


    return res.send(result);


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

async function AddMember(req, res) {
  try {
    connection = await oracledb.getConnection(connectionString);

    const first_name = req.body.FIRST_NAME
    const last_name = req.body.LAST_NAME
    const email = req.body.EMAIL
    const phoneNo = req.body.PHONE_NUMBER
    const DOB = req.body.DATE_OF_BIRTH
    const address = req.body.ADDRESS
    const password = req.body.PASSWORD

    result = await connection.execute(`INSERT INTO MEMBERS VALUES(${null}, 2, '${first_name}', '${last_name}', '${phoneNo}', TO_Date('${DOB}','dd-mon-yyyy'), '${email}', '${address}', '${password}')`);

    return res.send(result);


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

async function selectAllMembers(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM MEMBERS`);


    if (result?.rows?.length == 0) {
      //query return zero books
      return res.status(400).json({
        status: 'error',
        error: 'query send no rows',
      });
    } else {
      //send all books

      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.status(200).json({
        status: 'success',
        data: finalArray
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

async function selectUsers(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM MEMBERS WHERE TITLE_ID=2`);


    if (result?.rows?.length == 0) {
      //query return zero books
      return res.status(400).json({
        status: 'error',
        error: 'query send no rows',
      });
    } else {
      //send all books

      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.status(200).json({
        status: 'success',
        data: finalArray
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

async function selectUser(req, res) {

  try {

    console.log('connected to database');
    connection = await oracledb.getConnection(connectionString);


    // run query to get all books
    result = await connection.execute(`SELECT * FROM MEMBERS WHERE TITLE_ID=2 and MEMBER_ID=${req.params.id}`);

    if (result?.rows?.length == 0) {
      //query return zero books
      return res.status(400).json({
        status: 'error',
        error: 'query send no rows',
      });
    } else {
      //send all books

      const columns = result.metaData.map((col) => col.name);
      const data = result.rows;
      const finalArray = arrayToJSON(columns, data);

      return res.status(200).json({
        status: 'success',
        data: finalArray
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
module.exports = app;