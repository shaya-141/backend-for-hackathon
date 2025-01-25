import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    cnic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    department: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    status: { type: String, default: 'Pending' }, // Default status
    createdAt: { type: Date, default: Date.now },
});



const User = mongoose.model('User', userSchema);

export default User;