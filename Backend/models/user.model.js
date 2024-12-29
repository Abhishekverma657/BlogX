import mongoose from  'mongoose'
   

 const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
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
    // mentions: [
    //     {
    //         post: { type: mongoose.Schema.Types.ObjectId, ref: "post" }, // Post where mentioned
    //         mentionedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // User who mentioned
    //         date: { type: Date, default: Date.now }, // Timestamp for the mention
    //     },
    // ],

},{timestamps:true});
 export default mongoose.model('user',userSchema)



