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
router.get('/getvisitors', async (req, res) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to the start of the current day

        // Get today's visitors based on 'createdAt'
        const todayVisitors = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: currentDate }, // Filter for today's visitors
                },
            },
        ]);

        // New Visitors: Users with unique NIC-token combinations
        const newVisitors = await User.aggregate([
            {
                $group: {
                    _id: { nic: "$nic", token: "$token" }, // Group by NIC and token
                    count: { $sum: 1 }, // Count occurrences of each NIC-token combination
                    userData: { $push: "$$ROOT" } // Store all user documents in an array
                }
            },
            {
                $match: {
                    count: 1 // Match only the NIC-token combination that appears once (new visitor)
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    user: "$userData" // Include all user data
                }
            }
        ]);

        // Old Visitors: Users with more than one NIC-token combination (i.e., have visited before)
        const oldVisitors = await User.aggregate([
            {
                $group: {
                    _id: { nic: "$nic", token: "$token" }, // Group by NIC and token
                    count: { $sum: 1 }, // Count occurrences of each NIC-token combination
                    userData: { $push: "$$ROOT" } // Store all user documents in an array
                }
            },
            {
                $match: {
                    count: { $gt: 1 } // Match NIC-token combinations that appear more than once (old visitors)
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    user: "$userData" // Include all user data
                }
            }
        ]);

        console.log({ newVisitors, oldVisitors });

        // Return the response
        return sendResponse(res, 200, { todayVisitors, newVisitors, oldVisitors }, `Visitor count successfully`);
    } catch (error) {
        console.log("error>>>>", error);
        return res.status(500).json({ message: "Error in fetching visitor data" });
    }
});


export default router

