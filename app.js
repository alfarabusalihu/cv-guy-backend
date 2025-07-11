require('dotenv').config();
const cors = require('cors');
var express = require('express');
var app = express();
const loadResume=require ('./controllers/cv.parser')
const chatRoute=require("./routes/chat.route")
const emailRoute=require("./routes/email.route")


// ✅ Allow requests from frontend
app.use(cors({
    origin: [
    'https://cv-guy.vercel.app', 
    'https://cv-7inf193zw-alfars-projects-364a919f.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
loadResume().then(()=>console.log("Resume loaded and parsed successfully"))

app.use(express.json());
app.get('/', (req, res) => {
  res.send('CV-Guy backend is running!');
});
app.use("/api/chat",chatRoute)
app.use("/api/email",emailRoute)

const port=process.env.PORT||3001
app.listen(port,()=>{
  console.log(`server is running on http://localhost:${port}`)
}
)

module.exports = app;
