const mongoose =  require("mongoose")
const Schema =  mongoose.Schema ;

const replySchema =  new Schema({

    reply:String,
    author:String

} , {
    timestamps:true
})

const commentSchema  = new Schema({

    comment:{
        type:String ,
        required:true 
    } ,
    author:{
        type:String,
        required:true,
        unique:true
    },
reply:[
    replySchema
]
    
} , 

{
    timestamps:true
})

const blogSchema =  new Schema({


    title:{
        type:String ,
        required:true,
        unique:true
    } ,
    content:{
        type:String ,
        required:true
    }

    ,
    author:{
        type:Schema.Types.ObjectId,
        required:true
        ,
        ref:"Author"
    }
    ,
   banner:String ,
likes:{
    type:Number,
    default:0 
},
   comment:[commentSchema]

} ,  {
    timestamps:true
});


module.exports =  mongoose.model("Blog" , blogSchema);