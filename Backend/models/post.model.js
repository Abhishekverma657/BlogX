import mongoose from  'mongoose'
   

 const postSchema=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
   
   
    comments:[
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        
       
    ],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

     

},{timestamps:true});
 export default mongoose.model('post',postSchema)



