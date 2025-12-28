import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import userModel from "../models/user.model.js";


export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized User' });
        }

        // Check Redis blacklist only if Redis is connected
        try {
            if (redisClient.status === 'ready') {
                const isBlacklisted = await redisClient.get(token);
                if (isBlacklisted) {
                    return res.status(401).json({ message: 'Unauthorized User' });
                }
            }
        } catch (redisError) {
            console.log('Redis error, skipping blacklist check:', redisError.message);
            // Continue with authentication even if Redis is down
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized User' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}