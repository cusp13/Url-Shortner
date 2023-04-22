const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect');
const {restrictToLoggedinUserOnly,chechAuth} = require('./middlewares/auth')

const URL =require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user')

// mongodb://localhost:27017
 const app = express();
 const PORT=8001;
 connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>console.log("DataBase connected"));

app.set("view engine", "ejs");
app.set("views",path.resolve('./views'));


 app.use(express.json());
 app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


 app.use("/url",restrictToLoggedinUserOnly,urlRoute);
 app.use("/user",userRoute);
 app.use("/",chechAuth,staticRoute);
 

 app.get('/url/:shortId',async(req,res)=>{
     const shortId = req.params.shortId;
  const entry =  await URL.findOneAndUpdate({
        shortId
     },{
        $push:{
            visitHistory : {
                timestamp: Date.now()
            },
        }
     });
     res.redirect(entry.redirectURL)
 })

 app.listen(PORT,()=> console.log("Server is connected"));
