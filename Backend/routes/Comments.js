const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const {validateToken} = require("../middlewares/Authmiddleware");


router.get("/:postId", async (req,res) => {
    const id = req.params.postId;
    const comments = await Comments.findAll({where: {PostId: id}});
    res.json(comments); 
});


router.post("/", validateToken , async (req,res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comments.create(comment);
    res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId;

    await Comments.destroy({
        where:{
            id: commentId,
        },
    });

    res.json("Deleted Successfully");
});

module.exports = router;