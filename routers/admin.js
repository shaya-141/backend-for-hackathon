import express from 'express';
import sendResponse from '../helpers/response.js';
import User from '../models/user.js';



const router = express.Router();

router.get('/get-admin-data',async(req,res)=>{
    try {
        const { cnic, phone, name } = req.query;

        // Search functionality
        let searchCriteria = {};
        if (cnic) searchCriteria.cnic = cnic;
        if (phone) searchCriteria.phone = phone;
        if (name) searchCriteria.name = name;

        const data = await User.find(searchCriteria);

        return sendResponse(res,200,data,"user fetch successfully")
        
        
    } catch (error) {
        console.log("error...>>>>>",error);
        return sendResponse(res,400,null,"error in user fetch successfully")
        
    }
})
export default router

