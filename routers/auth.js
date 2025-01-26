import express from 'express';
import Joi from 'joi';
import sendResponse from '../helpers/response.js';
import User from '../models/user.js';
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import UserType from '../models/userType.js';
import bcryptjs from 'bcryptjs';
import req from 'express/lib/request.js';
import { authenticatUser } from '../middleware/authenticateUser.js';

const router = express.Router();

const addUserSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      }),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("receptionist", "manager","admin").required(),
    
  });

// Generate a Unique Token Function
function generateToken() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit random number
}

router.post('/register', async (req, res) => {
    const { cnic, address, name, contact, purpose, department } = req.body;

    let uniquetoken = generateToken(); 

    
    const userDetail = await User.findOne({ cnic });
    const findToken = await User.findOne({ token: uniquetoken });

   
    if (findToken) {
        uniquetoken = generateToken();
    }

    const newUser = new User({
        name: name,
        address: address,
        contact: contact,
        purpose: purpose,
        cnic: cnic,
        department: department,
        token: uniquetoken
    });

    await newUser.save();

    console.log("New User Registered: ", newUser);
    return sendResponse(res, 200, { newUser, userDetail }, 'User registered successfully');
});



router.get('/detailtoken', async (req, res) => {
    try {
      const { token } = req.query;  
      if (!token) {
        return sendResponse(res, 400, null, "Token is required");
      }
  
      const tokenDetail = await User.findOne({ token });
  
      if (!tokenDetail) {
        return sendResponse(res, 404, null, "Token not found");
      }
  
      return sendResponse(res, 200, tokenDetail, "Successfully fetched token details");
    } catch (error) {
      console.error("Error in fetching token details:", error);
      return sendResponse(res, 500, null, "An error occurred while fetching token details");
    }
  });

  router.put('/updatetoken', async (req, res) => {
    try {
        const { token } = req.query;
        const status = "approve";
        console.log("token",token);
        

        // Use findOneAndUpdate to update and return the updated document
        const updatedUser = await User.updateOne({ token }, { $set: {status} })

        
        return sendResponse(res, 200, updatedUser, "User updated successfully");


    } catch (error) {
        console.error("Error in updating token details:", error);
        return sendResponse(res, 500, null, "An error occurred while updating token details");
    }
});

router.post('/login', async (req, res) => {
    
  const {email,password} = req.body
    const user = await UserType.findOne({ email }).lean();
    if (!user) return sendResponse(res, 400, null, 'User not found');
  
    // Await bcrypt.compare() for password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return sendResponse(res, 400, null, 'Invalid password');
  
    // Sign the JWT with the plain user object
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.Auth_SECERET,{
      expiresIn: "30d", // 30 din ka expiry time
    });
  
    // Send the response, making sure the user is plain (no circular references)
    sendResponse(res, 200, { user, token }, 'User logged in successfully');



    return


  });

  router.get('/userDetail', async (req, res) => {
    try {
      const { email } = req.query;  // Extract the id from query parameters
      console.log("email",email);
    
      // Check if the ID is provided
      if (!email) {
        return sendResponse(res, 400, null, "email is required");
      }
  
      const userDetail = await UserType.findOne({ email: email });  // Find user by ID
  
      if (!userDetail) {
        return sendResponse(res, 404, null, "User not found");
      }
  
      return sendResponse(res, 200, userDetail, "User detail fetched successfully");
    } catch (error) {
      console.error("Error fetching user details:", error);
      return sendResponse(res, 500, null, "An error occurred while fetching user details");
    }
  });
  

  router.post('/addUser',async (req,res)=>{
    const {error,value} = addUserSchema.validate(req.body)

    if(error) return sendResponse(res,400,null,error.message)
        
    const email = req.body.email.toLowerCase();
    const user = await UserType.findOne({email})
    console.log("user",user);
    
    if(user){
         return sendResponse(res,400,null,'User already exist')
        
        }
    
    const hashPassword = bcryptjs.hashSync(req.body.password,10)

    const newUser = UserType({
        email:email,
        password:hashPassword,
        role:req.body.role

    })
    await newUser.save()
  

    console.log("newUser for register",newUser);
    sendResponse(res,200,newUser,'User created successfully')
    
    return

})





  router.delete('/deletetoken', async (req, res) => {

    try {
      const { token } = req.query; 
  
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
  
      const deletedToken = await User.findOneAndDelete({ token: token });
  
      
      if (!deletedToken) {
        return sendResponse(res,400,null,"Token not found")
      }
  
      return sendResponse(res,200,null,"Token deleted successfully")
      
    } catch (error) {
      console.error('Error deleting token:', error);
      sendResponse(res,400,null,"An error occurred while deleting token details",error)
      return
    }
  });
  


export default router;
