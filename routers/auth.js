import express from 'express';
import Joi from 'joi';
import sendResponse from '../helpers/response.js';
import User from '../models/user.js';
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import jwt from "jsonwebtoken";

const router = express.Router();

// Login Schema


// Generate a Unique Token Function
function generateToken() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit random number
}

router.post('/register', async (req, res) => {
    const { cnic, address, name, contact, purpose, department } = req.body;

    let uniquetoken = generateToken(); // Start with a generated token

    // Check if the generated token already exists in the database
    const userDetail = await User.findOne({ cnic });
    const findToken = await User.findOne({ token: uniquetoken });

    // If token exists, generate a new unique token
    if (findToken) {
        uniquetoken = generateToken();
    }

    // Create new user and save it
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
      const { token } = req.query;  // Get the token from query parameters
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
  



export default router;
