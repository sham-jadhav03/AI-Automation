import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();


const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 14239,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.log(err);
});


export default redisClient;