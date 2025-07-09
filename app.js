require('dotenv').config();
const cors = require('cors');
var express = require('express');
var path = require('path');
var app = express();
const loadResume=require ('./controllers/cv.parser')
const chatRoute=require("./routes/chat.route")
const emailRoute=require("./routes/email.route")


// ✅ Allow requests from frontend
app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
loadResume().then(()=>console.log("Resume loaded and parsed successfully"))

app.use(express.json());
app.use("/api/chat",chatRoute)
app.use("/api/email",emailRoute)

const port=process.env.PORT|3001
app.listen(port,()=>{
  console.log(`server is running on http://localhost:${port}`)
}
)

module.exports = app;
