import mongoose from "mongoose";
import 'dotenv/config';


const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to mongodb database is active")
    
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default dbConnect;