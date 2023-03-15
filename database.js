require('dotenv').config()
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.SQL_HOST,
    user     : process.env.SQL_USER,
    password : process.env.SQL_PASSWORD
  });

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  
var sql=`create database ${process.env.DATABASE}`;

connection.query(sql,(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('database created');
    }
})

sql=`use ${process.env.DATABASE}`
connection.query(sql,(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('database selected');
    }
})


 sql = "create table users ( name VARCHAR(255) PRIMARY KEY, password VARCHAR(255), score FLOAT)";
 connection.query(sql,(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('table created');
    }
})

connection.end();