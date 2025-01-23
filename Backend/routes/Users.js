const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt"); 
const {sign} = require("jsonwebtoken");


router.post("/", async (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        Users.create({
            username: username,
            password: hash,
        })
            .then(() => {
                res.json("Success");
            })
            .catch((error) => {
                console.error("Error creating user:", error);
                res.status(500).json({ error: "Failed to create user" });
            });
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await Users.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        // Compare provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Wrong password" });
        }

        // Successful login
        res.json({ message: "Successful login" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
