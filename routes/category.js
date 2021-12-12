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
    selectAllCategories(req, res);
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
    selectCategoryById(req, res, id);
})

//delete single data 
app.delete('/deletebyid/:id', (req, res) => {
    deleteCategoryByID(req, res);
});

//update single data
app.put('/updatebyid/:id', (req, res) => {
    console.log(req.body, 'updatedata');
    updateCategory(req, res);
});

// insertion
app.post('/insert', (req, res) => {
    console.log(req.body, 'createData');
    insertCategory(req, res);
});


async function selectAllCategories(req, res) {
    try {
        console.log('connected to database');
        connection = await oracledb.getConnection(connectionString);

        result = await connection.execute(`SELECT * FROM Category`);

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

async function selectCategoryById(req, res, id) {
    try {
        connection = await oracledb.getConnection(connectionString);
        // run query to get book with book_id
        result = await connection.execute(`SELECT * FROM Category where Category_id=:id`, [id]);

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

async function deleteCategoryByID(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const category_ID = req.params.id;

        result = await connection.execute(`delete from Category where Category_id='${category_ID}'`);

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

async function updateCategory(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const category_ID = req.params.id;
        const category_name = req.body.category_name;
        const cat_desc = req.body.cat_desc;

        result = await connection.execute(`update Category set Category_name='${category_name}',Cat_desc='${cat_desc}'
    where Category_id = ${category_ID}`);

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

async function insertCategory(req, res) {
    try {
        connection = await oracledb.getConnection(connectionString);

        const category_name = req.body.category_name;
        const cat_desc = req.body.cat_desc;

        result = await connection.execute(`insert into Category(Category_id,Category_name,Cat_desc) values(${null},'${category_name}','${cat_desc}'`);

        return res.send("INSERTED SUCCESFULLY");

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