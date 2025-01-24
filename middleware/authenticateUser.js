import sendResponse from "../helpers/response.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export async function authenticatUser(req, res, next) {
    try {
        const bearerToken = req?.headers?.authorization
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return sendResponse(res, 401, null, "Token is not Provided or invalid format", true);
        }

        const token = bearerToken.split(" ")[1]
        if (!token) {
            sendResponse(res, 501, null, "Token is not Provided", true)
        }

        let decoded
        try {

            decoded = jwt.verify(token, process.env.Auth_SECERET); // Ensure Auth_SECRET is correctly set in your environment variables
        } catch (error) {
            return sendResponse(res, 403, null, "Invalid or expired token", true);
        }

        const user = await User.findOne({ _id: decoded.id }).lean(); // Make sure your token payload includes `id`
        if (!user) {
          return sendResponse(res, 404, null, "User not found", true);
        }
        req.user = user;
        next()
    } catch (error) {
        console.error("Error in authenticateUser middleware:", error)
        sendResponse(res, 500, null, "Something Went Wrong", true)
    }
}