import mongoose from "mongoose";


const userTypeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});



const UserType = mongoose.model('UserType', userTypeSchema);

export default UserType;