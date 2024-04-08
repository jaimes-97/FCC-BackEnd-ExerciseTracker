require('dotenv').config();
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

//Schemas..
//User Schema:
const userSchema = new Schema({
  username: {type : String,
  required : true
  }  


});

userModel = mongoose.model('User',userSchema)

const exerciseSchema = new Schema({
id: {type: String},
description: {type: String},
duration: {type: Number},
date: {type: Date
   
}


})

exerciseSchema.pre('save', function (next) {

    this.duration = parseInt(this.duration);
      // Call the next function in the pre-save chain
      next();
    });

    
// exerciseSchema.path('date').get( function (value,next) {

//     const dateString = new Date(value).toDateString();
//       // Call the next function in the pre-save chain
//       next(null,dateString);
//     });

exerciseModel = mongoose.model('Exercise',exerciseSchema)

//Methods...
//User...
const createUser = function(username,done){
const user = new userModel({username})
user.save((err,data)=>{
    done(null,data)
})
}

const getUsers = function(done){
userModel.find((err,data)=>{
    if(err) console.log("Error reading users")
    done(null,data)
})
}

const getUserById = function(userId,done){
    userModel.findById({_id: userId},(err,data)=>{
        if(err) console.log("Error reading user by id:"+err)
        done(null,data)
    })
    }


//Exercise...
const createExercise = function(exercise,done){
    const newExercise = new exerciseModel(exercise)
    newExercise.save((err,data)=>{
        if(err) console.log("Error saving exercise: "+err)
        done(null,data)
    })
    }

    const getLog = function(id,options,done){

    getUserById(id,(err,user)=>{
        if(err) console.log("Error reading logs")
        const search = {};
       

       if(options.from && options.to) {
        search.date = { $gte: options.from, $lte: options.to }
       }
       search.id= user._id;
      

        exerciseModel.find(search).lean()
       . select({description: true,duration:true, date: true,_id: false})
        .limit(options.limit)
        .exec((err,exercises)=>{
            const count = exercises ? exercises.length : 0
            const logs = {
                username: user.username,
                count: count,
                _id: user._id,
                log: exercises

            }


            
       //format dates to string
       logs.log.forEach(element => {
        let string = element.date.toDateString();
        element.date = string;
       
      });



      
         

         
            done(null,logs)
        })

    })
      
}
    

//exports
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createExercise = createExercise;
exports.getLog = getLog;