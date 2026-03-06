import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Meeting } from "../models/meeting.model.js";


// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            username,
            password: hashedPassword
        });

        return res.status(httpStatus.CREATED)
            .json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
};


// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({ message: "Username and password required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED)
                .json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED)
                .json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        return res.status(httpStatus.OK).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
};


// ================= GET USER HISTORY =================
const getUserHistory = async (req, res) => {
    try {

        const meetings = await Meeting.find({ user_id: req.user.id });

        return res.status(httpStatus.OK).json({ meetings });

    } catch (error) {
        console.error("History Error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
};


// ================= ADD TO HISTORY =================
const addToHistory = async (req, res) => {
    try {

        const { meeting_code } = req.body;

        if (!meeting_code) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({ message: "Meeting code required" });
        }

        await Meeting.create({
            user_id: req.user.id,
            meetingCode: meeting_code
        });

        return res.status(httpStatus.CREATED)
            .json({ message: "Meeting saved successfully" });

    } catch (error) {
        console.error("Add History Error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
    }
};

export { register, login, getUserHistory, addToHistory };