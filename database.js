var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://deepanshu:calendar123@ds135952.mlab.com:35952/calendar");


var eventSchema = new mongoose.Schema({
 title: String,
 description: String,
 interviewer: String,
 startDate:Date,
 endDate:Date
});

let Event = mongoose.model("Events", eventSchema);;

var eventData = new Event({
  title: 'hello',
  description: 'hell',
  interviewer: 'Mr A',
  startDate:new Date(),
  endDate:new Date()
});
 eventData.save()
 .then(item => {
 console.log("saved to db")
 })
