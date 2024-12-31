import mongoose from  'mongoose'
   

 const userSchema=mongoose.Schema({
    name:{type:String,required:true },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String, required:true, unique:true},
    bio:{
        type:String,
        default:"Hey there! I am using BlogX"
    },
    Post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
      
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
      
    }],
    MentionedPosts: [
        {
          postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" }, // Mentioned post
          mentionedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Who mentioned this user
        },
      ],

},{timestamps:true});
 export default mongoose.model('user',userSchema)



