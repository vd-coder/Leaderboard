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

  router.get("/",async (req,res)=>{ 
    arr=await redis.zrange("newset",-50,-1,"WITHSCORES");
    arr1=await redis.zrange("newset",0,-1);
    arr1.reverse();
    let myRank=null;
    for(let i=0;i<arr.length;i=i+1)
    {
       if(req.session.username&&req.session.username==arr1[i])
       {
           myRank=i+1;
       }
    }
    arr.reverse();
    res.set("myRank",`${myRank}`);
    res.send(arr);
    
   })

   module.exports=router;