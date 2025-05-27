import mongoose from "mongoose"

const dbConnect = async() => {
   await mongoose.connect(process.env.MONGO_URI)
   .then(()=>console.log("database connected"))
   .catch((err)=> console.log(err))
}

export default dbConnect