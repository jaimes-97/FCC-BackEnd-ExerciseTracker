const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const createUser = require('./app.js').createUser
const getUsers = require('./app.js').getUsers
const getUserById = require('./app.js').getUserById
const createExercise = require('./app.js').createExercise
const getLog = require('./app.js').getLog
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.json())


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users',(req,res)=>{
  const username = req.body.username;
  createUser(username,(err,data)=>{
    if(err) {console.log("Error saving user")
    return res.status(500)
  }
    res.json(data)
  })
})

app.get('/api/users',(req,res)=>{
  getUsers((err,data)=>{
    if(err) {console.log("Error reading users")
    return res.status(500)
  }
    res.json(data)
  })
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  let exerciseDate = req.body.date ? new Date(req.body.date) : new Date(new Date().getTime()+20000);
  const exercise = {
    id: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: exerciseDate
  }
 


  createExercise(exercise,(err,data)=>{
    
    if(err)  return res.status(500)


    getUserById(data.id,(error,user)=>{
      if(error)  return res.status(500)
      
      const username = user.username;

      const response = {username,
      _id: data.id,
      description: data.description,
      duration: data.duration,
      date: data.date.toDateString()
      
      }
      res.json(response)
    })
  })




})

app.get('/api/users/:_id/logs',(req,res)=>{
  const {from,to,limit} = req.query
  const limitInt = limit ? parseInt(limit) : limit
  const options = {from,to,limit: limitInt}
  console.log({params: req.params._id, from: options.from, to:  options.to, limit: options.limitInt})
  getLog(req.params._id,options,(err,data)=>{
    if(err) res.status(500)


   res.json(data);
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
