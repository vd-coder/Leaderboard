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

router.post("/register", async(req,res)=>{
    username=req.body.uname
    password=req.body.psw
    salt=await bcrypt.genSalt(12);
    hashedPassword=await bcrypt.hash(password, salt);
    var sql = `INSERT INTO users (name, password,score) VALUES ("${username}", "${hashedPassword}",0)`;
    connection.query(sql);
    
        await redis.zadd("newset", 0, username);
        req.session.username=username;
        res.redirect("/");

})
router.get("/login",(req,res)=>{
    res.render('login');
})
router.post("/login",async (req,res)=>{
     username=req.body.uname
     password=req.body.psw
    var sql=`select password from users where name="${username}"`;
    queryPromise = () =>{
        return new Promise((resolve, reject)=>{
            connection.query(sql,  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };
    result=await queryPromise();
    
    hashedPassword=result[0].password; 
    match = await bcrypt.compare(password,hashedPassword );
    
    if(match)
    {
        req.session.username=username;
        res.redirect('/');
        
    }
    else
    {
        res.send("WRONG UNAME OR PASSWORD");
    }
}) 
router.get("/logout",(req,res)=>{
    req.session.username=null;
    res.redirect("/")
})

module.exports=router;