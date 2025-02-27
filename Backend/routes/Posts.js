const express = require("express");
const router = express.Router();
const {Posts} = require("../models");
const {Likes} = require("../models");


router.get("/", async (req, res) => {
    const listofPosts = await Posts.findAll({include: [Likes]});
    res.json(listofPosts);
});

router.get("/byId/:id", async (req,res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post); 
});

router.post("/", async (req, res) => {
    const post = req.body;
    await Posts.create(post);
    res.json(post);
});

module.exports = router;