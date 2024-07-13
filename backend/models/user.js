const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/paytm?replicaSet=rs0', {
    useNewUrlParser: true,
    useUnifiedTopology: true} )

const userschema = mongoose.Schema({
    firstname : {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 32
        
    },
    password: 
    {
        type: String,
        required: true,
     
    },

})

const usermodel = mongoose.model('User' , userschema)
module.exports = {usermodel}