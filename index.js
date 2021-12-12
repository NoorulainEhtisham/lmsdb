
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require("cors");

const bookRoutes = require('./routes/book');
const memberRoutes = require('./routes/member');
const authorRoutes = require('./routes/author');
const issuereturnRoutes = require('./routes/issuereturn');
const categoryRoutes = require('./routes/category')
const publisherRoutes = require('./routes/publisher')

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
app.use("/issuereturn", issuereturnRoutes);
app.use("/member", memberRoutes);
app.use("/category", categoryRoutes);
app.use("/publisher", publisherRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log("Node Server is Running on ", PORT);
});

module.exports = app;
