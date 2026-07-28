import mongoose from "mongoose";

const connectDB = async () => {
    console.log("URI:", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connneted");
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1)
    }
};

export default connectDB