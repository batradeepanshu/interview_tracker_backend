const express = require('express');
var mongoose = require("mongoose");
// const Event = require('./database');
const app = express();
bodyParser = require('body-parser');

var mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test").then((resp)=>{
  console.log('connected',resp);
},(err)=>{
  console.log('connection fail ho gya',err);
});


var eventSchema = new mongoose.Schema({
 title: String,
 desc: String,
 interviewer: String,
 start:Date,
 end:Date,
 deletecomment:String,
 deleted:Boolean
});

var interviewerSchema = new mongoose.Schema({
 name:String,
 color:String
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', function (req, res) {
let Event = mongoose.model("Events", eventSchema);;
let eventsJson={};
Event.find(function (err, events) {
  if (err) return console.error(err);

  eventsJson=events;
  return res.json(eventsJson);
})

   // res.header("Access-Control-Allow-Origin", "*");
   console.log('eventsjson',eventsJson);

});

app.get('/interviewer/get',function(req,res){
  console.log('inside interviewres get')
let interviewer = mongoose.model("Interviewer",interviewerSchema);
 interviewer.find(function(err,interviewers){
   if (err) return console.error(err);
   return res.json(interviewers);
 });
});
app.use(bodyParser.json());
app.post('/interviewer/save',function(req,res){
  let interviewer = mongoose.model("Interviewer",interviewerSchema);
  var interviewerData = new interviewer({
    name:req.body.intDetails.name,
    color:req.body.intDetails.color
});
var success=false;
 interviewerData.save()
 .then(item => {
 success=true;
return res.json({status:'success',saved:item})
});

})

app.post('/interviewer/delete',function(req,res){
  let Interviewer = mongoose.model("Interviewer", interviewerSchema);
  // if(req.body.code=='sapient@123'){
    Interviewer.find({ name:req.body.name }).remove().exec().then((response)=>{
      console.log('response from deletion',response);
      res.json({status:'success'});
    });
  // }else{
  //   res.send("access denied");
  // }

});



app.post('/save',function(req,res){
let Event = mongoose.model("Events", eventSchema);;
  var eventData = new Event({
    ...req.body.eventObject,
      start:new Date(req.body.eventObject.start),
      end: new Date(req.body.eventObject.end),
      deleted:false
  }
  );

  var success=false;
   eventData.save()
   .then(item => {
   success=true;
 return res.json({status:'success',savedEvent:item})
  });
});

app.post('/delete',function(req,res){
  let Event = mongoose.model("Events", eventSchema);
  console.log(req.body);

  // Event.find({ _id:req.body.id }).remove().exec().then((response)=>{
  //   console.log('response from deleteion',response);
  //   res.json({status:'success'});
  // });
  if(req.body.code=='sapient@123'){
    var query = { _id:req.body.id };
    // req.newData.username = req.user.username;
    Event.findOneAndUpdate(query, {deleted:true,deletecomment:req.body.comment}, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.send("succesfully deleted");
    });
  }else{
    res.send("access denied");
  }

});


app.listen(process.env.PORT || 8080);
