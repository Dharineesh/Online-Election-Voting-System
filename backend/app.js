const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '79Db7z3f~NYiv+e!',
    database: 'voting',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.message);
    } else {
        console.log('Connected to MySQL');
    }
});

app.use(cors());

app.use(bodyParser.json());