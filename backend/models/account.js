const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/paytm?replicaSet=rs0', {
    useNewUrlParser: true,
    useUnifiedTopology: true} )


const accountscheama = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    balance : {
        type : Number,
        required : true,
    }
})

const accountmodel = mongoose.model('Account' , accountscheama)
module.exports = {accountmodel}

// mongod --replSet rs0 --port 27017 --dbpath /data/rs0-0 --bind_ip localhost

// mongod --replSet rs0 --port 27018 --dbpath /data/rs0-1 --bind_ip localhost

// mongod --replSet rs0 --port 27019 --dbpath /data/rs0-2 --bind_ip localhost

// mongosh --port 27017

// rs.initiate({
//     _id: "rs0",
//     members: [
//         { _id: 0, host: "localhost:27017" },
//         { _id: 1, host: "localhost:27018" },
//         { _id: 2, host: "localhost:27019" }
//     ]
// })

// rs.status()
