const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String,required : true},
    email : {type: String,required : true},
    interest : {type: String,required : true},
    userImage : {type : String,required : true}

});

module.exports = mongoose.model('User',userSchema);