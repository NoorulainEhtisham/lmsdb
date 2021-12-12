const express = require('express');
const oracledb = require('oracledb');

oracledb.autoCommit = true;

const app = express();

const connectionString = {
    user: "hr",
    password: "hr",
    connectString: "localhost:1521/orclpdb"
}

let connection = undefined, result = undefined;

//get /getAllCategories
app.get('/getall', function (req, res) {
    selectAllPublishers(req, res);
})

//get /category?id=<id category>
app.get('/getbyid', function (req, res) {
    //get query param ?id
    let id = req.query.id;
    // id param if it is number
    if (isNaN(id)) {
        console.log(id);
        res.send('Query param id is not number')
        return
    }
    selectPublisherById(req, res, id);
})

//delete single data 
app.delete('/deletebyid/:id', (req, res) => {
    deletePublisherByID(req, res);
});

//update single data
app.put('/updatebyid/:id', (req, res) => {
    console.log(req.body, 'updatedata');
    updatePublisher(req, res);
});

// insertion
app.post('/insert', (req, res) => {
    console.log(req.body, 'createData');
    insertPublisher(req, res);
});


async function selectAllPublishers(req, res) {
    try {
        console.log('connected to database');
        connection = await oracledb.getConnection(connectionString);

        result = await connection.execute(`SELECT * FROM Publishers`);

        if (result?.rows?.length == 0) {
            return res.status(400).json({
                status: 'error',
                error: 'query send no rows',
            });
        } else {
            return res.status(200).json({
                status: 'succes',
                data: result?.rows
            });
        }

    } catch (err) {
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('close connection success');
            } catch (err) {
                console.error(err.message);
            }
        }

    }
}

async function selectPublisherById(req, res, id) {
    try {
        connection = await oracledb.getConnection(connectionString);
        // run query to get book with book_id
        result = await connection.execute(`SELECT * FROM Publishers where Publisher_id=:id`, [id]);

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

async function deletePublisherByID(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const publisher_ID = req.params.id;

        result = await connection.execute(`delete from Publishers where Publisher_id='${publisher_ID}'`);

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

async function updatePublisher(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const publisher_ID = req.params.id;
        const name = req.body.name;
        const address = req.body.address;
        const email = req.body.email;
        const phone_no = req.body.phone_no;


        result = await connection.execute(`update Publishers set name='${name}',address='${address}',email='${email}',phone_no='${phone_no}'
    where Publisher_id = ${publisher_ID}`);

        return res.send(result)

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

async function insertPublisher(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const name = req.body.name;
        const address = req.body.address;
        const email = req.body.email;
        const phone_no = req.body.phone_no;

        result = await connection.execute(`insert into Publishers(Publisher_id,name,address,email,phone_no) values(${null},'${name}','${address}','${email}','${phone_no}'`);

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


//////////////

module.exports = app;