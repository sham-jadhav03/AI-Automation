import * as userService from "../services/user.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.registerUser(req.body);
        const token = user.generateJWT();

        const userResponse = user.toObject ? user.toObject() : user;
        delete userResponse.password;

        res.cookie('token', token);

        res.status(201).json({ user: userResponse, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = user.generateJWT();

        const userResponse = user.toObject ? user.toObject() : user;
        delete userResponse.password;

        res.status(200).json({ user: userResponse, token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

export const profile = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: err.message });
    }
};