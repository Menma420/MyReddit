const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt"); 
const {sign} = require("jsonwebtoken");


router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await Users.findOne({ where: { username: username } });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await Users.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
        // Check if user exists
        const user = await Users.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        // Compare provided password with the hashed password
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) res.json({ error: "Wrong Username And Password Combination" });
        
            const accessToken = sign(
              { username: user.username, id: user.id },
              "importantsecret"
            );
            res.json(accessToken);
          });
});

module.exports = router;
