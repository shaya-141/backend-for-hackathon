
import express from 'express'
import Joi from 'joi'
import sendResponse from '../helpers/response.js';
import User from '../models/user.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router()


const registerSchema = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'Username should be a type of string',
            'string.empty': 'Username cannot be empty',
            'string.min': 'Username should be at least 3 characters long',
            'string.max': 'Username should be at most 30 characters long',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email should be a type of string',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'Password should be a type of string',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should be at least 6 characters long',
        }),
});
const loginSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      }),
    password: Joi.string().min(6).max(30).required(),
  })




router.post('/register', async (req, res) => {

    const { error, value } = registerSchema.validate(req.body)
    if (error) {
       return sendResponse(res, 400, null, "error in register a user", error)
    }
    const email = req.body.email.toLowerCase();
    const { userName, password } = req.body

    const user = await User.findOne({ email })
    if (user) {
        return sendResponse(res, 400, null, 'user already exist')

    }

    const hashPassword = bcrypt.hashSync(password, 10)

    const newUser = User({
        userName: userName,
        password: hashPassword,
        email: email

    })
    await newUser.save()

    console.log("newUser for register", newUser);
   return sendResponse(res, 200, newUser, 'user register successfully')


})

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, null, error.message);
  
    const email = value.email.toLowerCase();
  
    // check user if existed
    const user = await User.findOne({ email }).lean(); 
    if (!user) return sendResponse(res, 400, null, 'User not found');
  
    //  bcrypt.compare() for password validation
    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) return sendResponse(res, 400, null, 'Invalid password');
  
    // Sign the JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.Auth_SECERET,{
      expiresIn: "30d", // 30 din ka expiry time
    });
  
    // Send the response, 
    sendResponse(res, 200, { user, token }, 'User logged in successfully');



    return


  });




export default router


