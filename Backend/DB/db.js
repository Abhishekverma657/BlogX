 import mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect(
        
        "mongodb+srv://vermabhishek657:FBnl22t7Zz6SmOvV@cluster0.fyyi4.mongodb.net/", 
        
      );
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
       
     
    }
  };
   export default connectDB