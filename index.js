require('dotenv').config()
const express=require('express');
const app=express();
const path=require('path')
const session = require("express-session");
const mysql = require('mysql');
const Redis = require('ioredis');
const authRoutes = require("./routes/authRoutes");
const transactionRoutes=require("./routes/transactionRoutes");
const refreshRoutes=require("./routes/refreshRoutes");
const redis = new Redis({
    host: process.env.REDIS_HOST||"localhost",
    port: process.env.REDIS_PORT||6379,
    password: process.env.REDIS_PASSWORD
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
    secret: process.env.SECRET||"nosecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 3600 * 1000,
      maxage: 7 * 24 * 3600 * 1000,
    }, 
  };
app.use(session(sessionConfig));
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

app.use("/transaction",transactionRoutes)
app.use("/refresh",refreshRoutes);
app.use("/", authRoutes);
app.get("/",(req,res)=>{
    
    res.render("home",{activeUser:req.session.username});
})

app.listen(process.env.PORT||3000,()=>{
    console.log("connection established");
}) 

