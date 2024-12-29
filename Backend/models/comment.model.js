import mongoose from  'mongoose'
   

 const commentSchema=mongoose.Schema({
    comment:{type:String,required:true},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
    

},{timestamps:true});
 export default mongoose.model('comment',commentSchema)



