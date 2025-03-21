const express = require("express"); 
const db = require("./models");
const cors = require("cors");

const app = express();
app.use(express.json());    
app.use(cors());

const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log("Server is running on port 4000");
    });
}).catch((err) => {
    console.log(err);
});

