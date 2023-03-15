require('dotenv').config()
const express=require('express');

const router = express.Router();
const bcrypt=require('bcrypt')
router.get("/register",(req,res)=>{
    res.render('register');
})
const Redis = require('ioredis');
const mysql = require('mysql');
const redis = new Redis({
    host: process.env.REDIS_HOST||"localhost",
    port: process.env.REDIS_PORT||6379,
    password: process.env.REDIS_PASSWORD
});
const connection = mysql.createConnection({
    host     : process.env.SQL_HOST||"localhost",
    user     : process.env.SQL_USER||"root",
    password : process.env.SQL_PASSWORD,
    database :process.env.DATABASE
    
  });
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

router.get("/buy-sell",(req,res)=>{
    if(!req.session.username)
    {
        res.redirect("/");
    }
    res.render("buy-sell")
})
router.post("/buy",async (req,res)=>{
    if(!req.session.username)
    {
        res.redirect("/");
    }
    amount=Number(req.body.buy);
    username=req.session.username
    await redis.zincrby("newset",amount,username);
    var sql=`select score from users where name="${username}" `;
    connection.query(sql,(err,result)=>{
        if(result)
        {
            var sql1=`update users set score=${result[0].score+amount} where name="${username}"`;
            connection.query(sql1);
        }
    })
    res.redirect("/");
})
router.post("/sell",async (req,res)=>{
    if(!req.session.username)
    {
        res.redirect("/");

    }
    amount=-Number(req.body.sell);
    username=req.session.username
    await redis.zincrby("newset",amount,username);
    var sql=`select score from users where name="${username}" `;
    connection.query(sql,(err,result)=>{
        if(result)
        {
            var sql1=`update users set score=${result[0].score+amount} where name="${username}"`;
            connection.query(sql1);
        }
    })
    res.redirect("/")
})

module.exports=router;