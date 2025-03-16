const express = require("express");
const router = express.Router();
const {Posts} = require("../models");
const {Likes} = require("../models");
const {validateToken} = require("../middlewares/Authmiddleware");

router.get("/", validateToken, async (req, res) => {
    const listofPosts = await Posts.findAll({include: [Likes]});

    const likedPosts = await Likes.findAll({where: {UserId: req.user.id}});
    res.json({listofPosts: listofPosts, likedPosts: likedPosts});
});

router.get("/byId/:id", async (req,res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post); 
});

router.post("/", validateToken , async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    await Posts.create(post);
    res.json(post);
});

router.delete("/:postId", validateToken, async (req,res) =>{
    const postId = req.params.postId;
    await Posts.destroy({
        where:{
            id: postId,
        },
    });

    res.json("Post deleted");
});

module.exports = router;