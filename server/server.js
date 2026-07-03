const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("Welcome to StudyTrack API!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});