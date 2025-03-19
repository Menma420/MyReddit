const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt"); 
const {sign} = require("jsonwebtoken");
const {validateToken} = require("../middlewares/Authmiddleware");
const { where } = require("sequelize");

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
            res.json({token: accessToken, username: username, id: user.id});
        });
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get('/basicInfo/:id' , async (req, res) => {
    const id = req.params.id;

    const basicInfo = await Users.findByPk(id, {attributes: {exclude: ['password'] }});

    res.json(basicInfo);
});

router.put('/changePassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const username = req.user.username;

    const user = await Users.findOne({ where: { username: username } });

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) return res.json({ error: "Wrong Password" });
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Users.update({password: hashedPassword}, { where: {username: username}});
        res.json("Password changed successfully");
    });
});

module.exports = router;
