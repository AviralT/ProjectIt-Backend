const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
var bodyParser = require('body-parser');
const userRoutes = require('./Routes/user');
const projectRoutes = require('./Routes/project');

const app = express();

app.use(cors())

app.use(bodyParser.json());

const PORT = 5000;

app.use('/', userRoutes);
app.use('/', projectRoutes);

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });   
// app.use(cors({credentials: true, origin: 'http://localhost:3001'}));

app.get('/', (req, res) => {
    console.log('requested!');
    console.log(req.query.username);
    console.log(req.query.password);
    res.send({ result: "App Started" });
})

// DB Connection
mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Mongo Connected!!!')
}).catch(err => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log(`app started ${PORT}`)
});
