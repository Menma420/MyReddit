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


db.sequelize.sync().then(() => {
    app.listen(4000, () => {
        console.log("Server is running on port 4000");
    });
});

