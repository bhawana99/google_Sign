/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
const db = require("./db");
const collection = 'todo';


app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname,'index.html'));
});


//read
app.get('/getTodos',(req,res)=>{
   db.getDB().collection(collection).find({}).toArray((err,documents)=>{
      if(err){
          console.log(err);
      }else{
          //console.log(documents);
          res.json(documents);
      }
   });
}); 

//update
app.put('/:id',(req,res)=>{
   const todoID= req.params.id;
   const userInput = req.body;
   db.getDB().collection(collection).findOneAndUpdate({_id:db.getPrimaryKey(todoID)},{$set:{todo:userInput.todo}},{returnOriginal:false},(err,result)=>{
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.json(result);
      }
   });
});

//create
app.post('/',(req,res)=>{
   const userInput = req.body;
   db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
      if(err)
         console.log(err);
      else
         res.json({result:result,document : result.ops[0]});
   });
});

app.delete('/:id',(req,res)=>{
   const todoID = req.params.id;
   db.getDB().collection(collection).findOneAndDelete({_id:db.getPrimaryKey(todoID)},(err,result)=>{
      if(err)
        console.log(err);
      else
        res.json(result);
   });
});


db.connect((err)=>{
  if(err){
    console.log('unable to connect to databse');
    process.exit(1);
  }
  else{
    app.listen(3000,()=>{
      console.log('connect to database');
    });
  }
});