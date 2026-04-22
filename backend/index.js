const dns = require('dns').promises;   // or just require('dns') in older Node
dns.setServers(['8.8.8.8', '1.1.1.1']);   // to fix DNS refused block error
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ================= DB CONNECT ================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= MODEL ================= */
const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    course: String
});

const Student = mongoose.model("Student", studentSchema);

/* ================= AUTH MIDDLEWARE ================= */
const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: "Invalid token" });
    }
};

/* ================= ROUTES ================= */

// REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ msg: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = new Student({
            name,
            email,
            password: hashed,
            course
        });

        await user.save();
        res.json({ msg: "Registered successfully" });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Student.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

// UPDATE PASSWORD
app.put("/api/update-password", auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await Student.findById(req.user.id);

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong old password" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ msg: "Password updated" });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

// UPDATE COURSE
app.put("/api/update-course", auth, async (req, res) => {
    try {
        const { course } = req.body;

        const user = await Student.findById(req.user.id);
        user.course = course;

        await user.save();

        res.json({ msg: "Course updated" });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

// DASHBOARD (Protected)
app.get("/api/dashboard", auth, async (req, res) => {
    const user = await Student.findById(req.user.id).select("-password");
    res.json(user);
});

/* ================= SERVER ================= */
app.listen(5000, () => console.log("Server running on port 5000"));