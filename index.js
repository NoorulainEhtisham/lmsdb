
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require("cors");

const bookRoutes = require('./routes/book');
const authorRoutes = require('./routes/author');

const app = express();

app.use(bodyParser.json());

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use("/book", bookRoutes);
app.use("/author", authorRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log("Node Server is Running on ", PORT);
});

module.exports = app;
