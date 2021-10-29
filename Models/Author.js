const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const AuthorSchema =  Schema({


    name:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        required:true
    },
    blogs:[
        {
            type:Schema.Types.ObjectId,
            ref:"Blog"
        }
    ],

    age:String,
    gender:String,
   
})


module.exports =  mongoose.model("Author" , AuthorSchema);